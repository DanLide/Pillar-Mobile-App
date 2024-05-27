import i18n from 'i18next';
import { v1 as uuid } from 'uuid';

import { Task, TaskExecutor, getProductStepQty } from './helpers';
import { getFetchProductsByFacilityIdAPI } from './api';

import { ProductModel } from '../stores/types';
import { CreateInvoiceStore } from '../modules/createInvoice/stores';

interface FetchProductsByFacilityIdCodeContext {
  products: ProductModel[];
}

export const fetchProductsByFacilityId = async (store: CreateInvoiceStore) => {
  const productsContext: FetchProductsByFacilityIdCodeContext = {
    products: [],
  };
  const result = await new TaskExecutor([
    new FetchProductsByFacilityIdTask(productsContext),
    new SaveProductsToStoreTask(productsContext, store),
  ]).execute();

  return result;
};

export class FetchProductsByFacilityIdTask extends Task {
  productsContext: FetchProductsByFacilityIdCodeContext;

  constructor(productsContext: FetchProductsByFacilityIdCodeContext) {
    super();
    this.productsContext = productsContext;
  }

  async run(): Promise<void> {
    const response = await getFetchProductsByFacilityIdAPI();
    if (response) {
      this.productsContext.products = response;
    } else {
      throw Error(i18n.t('requestFailed'));
    }
  }
}

export class SaveProductsToStoreTask extends Task {
  productContext: FetchProductsByFacilityIdCodeContext;
  createInvoiceStore: CreateInvoiceStore;

  constructor(
    productContext: FetchProductsByFacilityIdCodeContext,
    createInvoiceStore: CreateInvoiceStore,
  ) {
    super();
    this.productContext = productContext;
    this.createInvoiceStore = createInvoiceStore;
  }

  async run(): Promise<void> {
    if (this.productContext.products) {
      this.createInvoiceStore.setFacilityProducts(
        this.mapProductsResponse(this.productContext.products),
      );
    }
  }

  private mapProductsResponse(products: ProductModel[]): ProductModel[] {
    return products.map(product => ({
      ...product,
      uuid: uuid(),
      reservedCount: getProductStepQty(product.inventoryById),
      inventoryUseTypeId: product.inventoryById || 0,
      nameDetails: [product.manufactureCode, product.partNo, product.size].join(
        ' ',
      ),
    }));
  }
}
