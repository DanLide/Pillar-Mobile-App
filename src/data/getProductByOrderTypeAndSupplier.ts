import { v1 as uuid } from 'uuid';
import { encode as btoa } from 'base-64';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { CurrentProductStoreType, ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrderSummaryProduct,
  getProductByOrderTypeAndSupplierAPI,
} from './api/orders';
import { getFetchProductAPI, getFetchProductByFacilityIdAPI } from './api';
import { BadRequestError } from './helpers/tryFetch';
import { stocksStore } from '../modules/stocksList/stores';
import { getProductSettingsByIdAPI } from './api/productsAPI';

interface FetchProductByOrderTypeAndSupplierContext {
  product?: GetOrderSummaryProduct;
}

export enum ProductByOrderTypeAndSupplierError {
  NotAssignedToDistributor = 'NotAssignedToDistributor',
  NotAssignedToStock = 'NotAssignedToStock',
}

export const getProductByOrderTypeAndSupplier = async (
  store: OrdersStore,
  scanCode: string,
) => {
  const productContext: FetchProductByOrderTypeAndSupplierContext = {
    product: undefined,
  };
  return new TaskExecutor([
    new FetchProductByOrderTypeAndSupplier(productContext, scanCode, store),
    new SaveProductToStoreTask(productContext, store),
  ]).execute();
};

const getProductSupplier = async (code: string) => {
  const supplierId = stocksStore.getSupplierIdByUpc(code);

  if (supplierId) return supplierId;

  const product = await getFetchProductByFacilityIdAPI(code.replace('~~', ''));

  return product?.[0].supplierId;
};

export class FetchProductByOrderTypeAndSupplier extends Task {
  productContext: FetchProductByOrderTypeAndSupplierContext;
  scanCode: string;
  store: OrdersStore;

  constructor(
    productContext: FetchProductByOrderTypeAndSupplierContext,
    scanCode: string,
    store: OrdersStore,
  ) {
    super();
    this.productContext = productContext;
    this.scanCode = scanCode;
    this.store = store;
  }

  async run(): Promise<void> {
    const productSupplier = await getProductSupplier(this.scanCode);

    if (!this.store.supplierId) {
      this.store.setSupplier(productSupplier);
    }

    const selectedSupplier = this.store.supplierId;

    if (!productSupplier) return;

    if (selectedSupplier !== productSupplier) {
      const supplierName = stocksStore.getSupplierNameById(productSupplier);

      throw new BadRequestError(
        ProductByOrderTypeAndSupplierError.NotAssignedToDistributor,
        supplierName,
      );
    }

    const product = await getProductByOrderTypeAndSupplierAPI(this.scanCode);

    if (!product) return;

    const { productId, storageAreaId, storageAreaName } = product;

    const currentStock = this.store.currentStock;

    if (storageAreaId !== currentStock?.partyRoleId) {
      throw new BadRequestError(
        ProductByOrderTypeAndSupplierError.NotAssignedToStock,
        storageAreaName,
      );
    }

    const [productDetails, settings] = await Promise.all([
      getFetchProductAPI(btoa(this.scanCode), currentStock),
      getProductSettingsByIdAPI(productId, currentStock),
    ]);

    this.productContext.product = {
      ...product,
      unitsPer: productDetails?.unitPer ?? 0,
      onHand: productDetails?.onHand ?? 0,
      onOrder: productDetails?.onOrder ?? 0,
      max: settings?.max ?? 0,
      min: settings?.min ?? 0,
    };
  }
}

export class SaveProductToStoreTask extends Task {
  productContext: FetchProductByOrderTypeAndSupplierContext;
  currentProductStore: CurrentProductStoreType;

  constructor(
    productContext: FetchProductByOrderTypeAndSupplierContext,
    currentProductStore: CurrentProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.currentProductStore = currentProductStore;
  }

  async run(): Promise<void> {
    const { product } = this.productContext;

    this.currentProductStore.setCurrentProduct(
      product && this.mapProductResponse(product),
    );
  }

  private mapProductResponse(product: GetOrderSummaryProduct): ProductModel {
    const { manufactureCode, partNo, size, inventoryUseTypeId } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: getProductStepQty(inventoryUseTypeId),
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: false,
    };
  }
}
