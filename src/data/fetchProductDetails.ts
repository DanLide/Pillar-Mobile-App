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
import { find, pipe, prop, whereEq } from 'ramda';
import { stocksStore } from '../modules/stocksList/stores';
import { SupplierModel } from '../modules/stocksList/stores/StocksStore';

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

    if (!product) return;

    const { productId } = product;

    const [settings, enabledSuppliers = []] = await Promise.all([
      getProductSettingsByIdAPI(productId, currentStock),
      getEnabledSuppliersByProductIdAPI(productId),
    ]);

    const orderMultiple = pipe(
      find(whereEq({ productId })),
      prop('orderMultiple'),
    )(stocksStore.facilityProducts);

    const restockFromId =
      settings?.replenishedFormId ||
      find(whereEq({ name: 'Distributor' }), enabledSuppliers)?.partyRoleId;

    this.productContext.enabledSuppliers = enabledSuppliers;

    this.productContext.product = {
      ...product,
      max: settings?.max,
      min: settings?.min,
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

    stocksStore.setEnabledSuppliers(enabledSuppliers);

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
