import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { CurrentProductStoreType, ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrderSummaryProduct,
  getProductByOrderTypeAndSupplierAPI,
} from './api/orders';
import { getFetchProductByFacilityIdAPI } from './api';

interface FetchProductByOrderTypeAndSupplierContext {
  product?: GetOrderSummaryProduct;
}

enum ProductByOrderTypeAndSupplierError {
  NotAssignedToDistributor,
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

const fetchProductSupplier = async (code: string) => {
  const product = await getFetchProductByFacilityIdAPI(code.replace('~~', ''));

  console.log('\nproduct by facility\n', product);

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
    const selectedSupplier = this.store.supplierId;

    const productSupplier =
      selectedSupplier || (await fetchProductSupplier(this.scanCode));

    console.log('\nproduct supplier\n', productSupplier);

    if (productSupplier) {
      this.productContext.product = await getProductByOrderTypeAndSupplierAPI(
        this.scanCode,
        productSupplier,
      );
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
