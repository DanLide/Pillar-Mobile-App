import i18n from 'i18next';
import { clone } from 'ramda';

import { Task } from './helpers';
import { ReturnProductsStore } from '../modules/returnProducts/stores';
import { returnProductAPI, getFetchJobDetailQuantityAPI } from './api';

export const onReturnProducts = async (
  returnProductsStore: ReturnProductsStore,
) => {
  try {
    await new ReturnProductTask(returnProductsStore).run();
  } catch (error) {
    return error;
  }
};

export class ReturnProductTask extends Task {
  returnProductsStore: ReturnProductsStore;
  hasError: boolean;

  constructor(returnProductsStore: ReturnProductsStore) {
    super();
    this.returnProductsStore = returnProductsStore;
    this.hasError = false;
  }

  async run() {
    const products = clone(this.returnProductsStore.getProducts);

    for (const product of products) {
      if (!product.isRemoved) {
        try {
          const jobDetail = product.job?.jobId
            ? await getFetchJobDetailQuantityAPI(product)
            : undefined;

          await returnProductAPI(product, jobDetail?.jobDetailId);
          product.isRemoved = true;
        } catch (error) {
          this.hasError = true;
        }
      }
    }

    this.returnProductsStore.setProducts(products);

    if (this.hasError) throw Error(i18n.t('requestFailed'));
  }
}
