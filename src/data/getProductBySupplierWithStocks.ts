import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { CurrentProductStoreType, ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrderSummaryProduct,
  getProductByOrderTypeAndSupplierAPI,
  getProductMultipleStocks,
} from './api/orders';
import { BadRequestError } from './helpers/tryFetch';
import { getFetchProductByFacilityIdAPI } from './api';
import { stocksStore } from '../modules/stocksList/stores';

interface FetchProductByOrderTypeAndSupplierContext {
  product?: GetOrderSummaryProduct;
}

export enum ProductByOrderTypeAndSupplierError {
  NotAssignedToDistributor = 'NotAssignedToDistributor',
  NotAssignedToStock = 'NotAssignedToStock',
}

export const getProductBySupplierWithStocks = async (
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

export const saveCurrentProduct = (
  product: GetOrderSummaryProduct,
  store: OrdersStore,
) => {
  const productContext: FetchProductByOrderTypeAndSupplierContext = {
    product: product,
  };
  return new TaskExecutor([
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

    let productMultipleStockLocations;
    let product: GetOrderSummaryProduct | undefined;
    try {
      productMultipleStockLocations = await getProductMultipleStocks(
        this.scanCode,
      );
      product = await getProductByOrderTypeAndSupplierAPI(this.scanCode);
      if (!product && !productMultipleStockLocations?.length) {
        return;
      }
    } finally {
      if (productMultipleStockLocations?.length > 1) {
        this.store.setBackorderCabinets(productMultipleStockLocations);
        this.store.setCabinetSelection(true);
      } else {
        const availableStocks =
          stocksStore.stocks.filter(stock =>
            product?.cabinets.find(
              cabinet => stock.partyRoleId === cabinet.storageAreaId,
            ),
          ) || [];
        this.store.setCurrentStocks(availableStocks[0]);
        this.productContext.product = product;
      }
    }
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
