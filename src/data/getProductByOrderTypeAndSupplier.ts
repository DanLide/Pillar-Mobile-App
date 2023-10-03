import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { CurrentProductStoreType, ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrderSummaryProduct,
  getProductByOrderTypeAndSupplierAPI,
} from './api/orders';
import { getFetchProductByFacilityIdAPI } from './api';
import { BadRequestError } from './helpers/tryFetch';
import { stocksStore } from '../modules/stocksList/stores';

interface FetchProductByOrderTypeAndSupplierContext {
  product?: GetOrderSummaryProduct;
}

enum ProductByOrderTypeAndSupplierError {
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

    const selectedSupplier = this.store.supplierId || productSupplier;

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
      productSupplier,
    );

    if (product?.storageAreaId !== this.store.currentStock?.partyRoleId) {
      throw new BadRequestError(
        ProductByOrderTypeAndSupplierError.NotAssignedToStock,
        product?.storageAreaName,
      );
    }

    this.productContext.product = product;
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

    console.log('\nproduct\n', product);

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
