import { clone } from 'ramda';

import { Task } from './helpers';
import { RemoveProductsStore } from '../modules/removeProducts/stores';
import { removeProductAPI, RemoveProductResponse } from './api';

export const onRemoveProducts = async (
  removeProductsStore: RemoveProductsStore,
) => {
  try {
    await new RemoveProductTask(removeProductsStore).run();
  } catch (error) {
    return error;
  }
};

export class RemoveProductTask extends Task {
  removeProductsStore: RemoveProductsStore;
  hasError: boolean;

  constructor(removeProductsStore: RemoveProductsStore) {
    super();
    this.removeProductsStore = removeProductsStore;
    this.hasError = false;
  }

  async run() {
    const productsJobIds = Object.keys(this.removeProductsStore.getProducts);

    for (const jobId of productsJobIds) {
      const removeProductRequests = this.removeProductsStore.getProducts[
        jobId
      ].reduce<Promise<RemoveProductResponse>[]>((acc, product) => {
        if (!product.isRemoved) {
          acc = [...acc, removeProductAPI(product)];
        }
        return acc;
      }, []);

      const responses = await Promise.allSettled(removeProductRequests);

      this.updateProductsByResponses(responses, jobId);
    }

    if (this.hasError) throw Error('Request failed!');
  }

  private updateProductsByResponses(
    responses: PromiseSettledResult<RemoveProductResponse>[],
    jobId: string,
  ) {
    const products = responses.map((response, index) => {
      const product = clone(
        this.removeProductsStore.getProducts[jobId].filter(
          product => product.isRemoved === false,
        )[index],
      );

      if (response.status === 'fulfilled') {
        product.isRemoved = true;
      } else {
        this.hasError = true;
      }
      return product;
    });

    const removedProducts =
      this.removeProductsStore.getRemovedProducts[jobId] || [];

    this.removeProductsStore.updateProductsByKey(jobId, [
      ...products,
      ...removedProducts,
    ]);
  }
}
