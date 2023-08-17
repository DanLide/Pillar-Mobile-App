import { v1 as uuid } from 'uuid';

import { Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import {
  getEnabledSuppliersByProductIdAPI,
  getProductSettingsByIdAPI,
  ProductResponse,
} from './api/productsAPI';

import {
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../stores/types';
import { SupplierModel } from '../stores/SuppliersStore';
import { suppliersStore } from '../stores';
import { find, whereEq } from 'ramda';

interface FetchProductByScannedCodeContext {
  product?: ProductResponse;
  enabledSuppliers: SupplierModel[];
}

export const fetchProductDetails = async (
  store: CurrentProductStoreType & StockProductStoreType,
  scanCode: string,
) => {
  const productContext: FetchProductByScannedCodeContext = {
    product: undefined,
    enabledSuppliers: [],
  };
  return new TaskExecutor([
    new FetchProductDetails(productContext, scanCode, store),
    new SaveProductToStoreTask(productContext, store),
  ]).execute();
};

export class FetchProductDetails extends Task {
  productContext: FetchProductByScannedCodeContext;
  scanCode: string;
  stockStore?: StockProductStoreType;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    scanCode: string,
    stockStore?: StockProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.stockStore = stockStore;
    this.scanCode = scanCode;
  }

  async run(): Promise<void> {
    const currentStock = this.stockStore?.currentStock;

    const product = await getFetchProductAPI(this.scanCode, currentStock);

    const [settings, enabledSuppliers] = await Promise.all([
      getProductSettingsByIdAPI(product.productId, currentStock),
      getEnabledSuppliersByProductIdAPI(product.productId),
    ]);

    const { max, min, orderMultiple, replenishedFormId } = settings;

    const restockFromId =
      replenishedFormId ||
      find(whereEq({ name: 'Distributor' }), enabledSuppliers)?.partyRoleId;

    this.productContext.enabledSuppliers = enabledSuppliers;

    this.productContext.product = {
      ...product,
      max,
      min,
      orderMultiple,
      replenishedFormId: restockFromId,
    };
  }
}

export class SaveProductToStoreTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  currentProductStore: CurrentProductStoreType;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    currentProductStore: CurrentProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.currentProductStore = currentProductStore;
  }

  async run(): Promise<void> {
    const { product, enabledSuppliers } = this.productContext;

    suppliersStore.setEnabledSuppliers(enabledSuppliers);

    this.currentProductStore.setCurrentProduct(
      product && this.mapProductResponse(product),
    );
  }

  private mapProductResponse(product: ProductResponse): ProductModel {
    const {
      onHand,
      isRecoverable,
      manufactureCode,
      partNo,
      size,
      inventoryClassificationTypeId,
      unitPer,
    } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: onHand,
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: isRecoverable === 'Yes',
      categoryId: Number(inventoryClassificationTypeId),
      unitsPerContainer: unitPer,
    };
  }
}
