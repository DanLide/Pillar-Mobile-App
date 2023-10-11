import { v1 as uuid } from 'uuid';

import { Task, TaskExecutor } from './helpers';
import { ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import { getSuggestedProductsAPI, OrderProductResponse } from './api/orders';

interface FetchSuggestedProductsContext {
  products: OrderProductResponse[];
}

export const fetchSuggestedProducts = async (store: OrdersStore) => {
  const productContext: FetchSuggestedProductsContext = {
    products: [],
  };
  return new TaskExecutor([
    new FetchSuggestedProductsTask(productContext, store),
    new SaveProductsToStoreTask(productContext, store),
  ]).execute();
};

export class FetchSuggestedProductsTask extends Task {
  productContext: FetchSuggestedProductsContext;
  store: OrdersStore;

  constructor(
    productContext: FetchSuggestedProductsContext,
    store: OrdersStore,
  ) {
    super();
    this.productContext = productContext;
    this.store = store;
  }

  async run(): Promise<void> {
    const products = await getSuggestedProductsAPI();

    if (!products) throw new Error();

    this.productContext.products = products;
  }
}

export class SaveProductsToStoreTask extends Task {
  productContext: FetchSuggestedProductsContext;
  store: OrdersStore;

  constructor(
    productContext: FetchSuggestedProductsContext,
    store: OrdersStore,
  ) {
    super();
    this.productContext = productContext;
    this.store = store;
  }

  async run(): Promise<void> {
    const { products } = this.productContext;

    const mappedProducts = products.map(this.mapProductResponse);

    mappedProducts.forEach(this.store.addProduct);
  }

  private mapProductResponse(product: OrderProductResponse): ProductModel {
    const { manufactureCode, partNo, size, orderedQty } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: orderedQty,
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: false,
    };
  }
}
