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
import { OrderType } from 'src/constants/common.enum';
import { Utils } from 'src/data/helpers/utils';

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
  orderType = OrderType.Purchase,
) => {
  const productContext: FetchProductByOrderTypeAndSupplierContext = {
    product: undefined,
  };
  return new TaskExecutor([
    new FetchProductByOrderTypeAndSupplier(
      productContext,
      scanCode,
      orderType,
      store,
    ),
    new SaveProductToStoreTask(productContext, orderType, store),
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
  orderType?: OrderType;

  constructor(
    productContext: FetchProductByOrderTypeAndSupplierContext,
    scanCode: string,
    orderType: OrderType,
    store: OrdersStore,
  ) {
    super();
    this.productContext = productContext;
    this.scanCode = scanCode;
    this.orderType = orderType;
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

    const product = await getProductByOrderTypeAndSupplierAPI(
      this.scanCode,
      this.orderType,
    );

    if (!product) return;

    const { productId, storageAreaId, storageAreaName } = product;

    const currentStock = this.store.currentStock;

    if (storageAreaId !== currentStock?.partyRoleId) {
      throw new BadRequestError(
        ProductByOrderTypeAndSupplierError.NotAssignedToStock,
        storageAreaName,
      );
    }

    const [productDetailsResponse, settingsResponse] = await Promise.allSettled(
      [
        getFetchProductAPI(btoa(this.scanCode), currentStock.partyRoleId),
        getProductSettingsByIdAPI(productId, currentStock),
      ],
    );

    const productDetails = Utils.isPromiseFulfilled(productDetailsResponse)
      ? productDetailsResponse.value
      : null;

    const settings = Utils.isPromiseFulfilled(settingsResponse)
      ? settingsResponse.value
      : null;

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
  orderType: OrderType;
  currentProductStore: CurrentProductStoreType;

  constructor(
    productContext: FetchProductByOrderTypeAndSupplierContext,
    orderType: OrderType,
    currentProductStore: CurrentProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.orderType = orderType;
    this.currentProductStore = currentProductStore;
  }

  async run(): Promise<void> {
    const { product } = this.productContext;

    this.currentProductStore.setCurrentProduct(
      product && this.mapProductResponse(product, this.orderType),
    );
  }

  private mapProductResponse(
    product: GetOrderSummaryProduct,
    orderType: OrderType,
  ): ProductModel {
    const { manufactureCode, partNo, size, inventoryUseTypeId } = product;

    const reservedCount = getProductStepQty(inventoryUseTypeId, {
      disableDecimals: orderType === OrderType.Purchase,
    });

    return {
      ...product,
      isRemoved: false,
      reservedCount,
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: false,
    };
  }
}
