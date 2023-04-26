import { Task } from './helpers';
import { RemoveProductsStore } from '../modules/removeProducts/stores';
import { removeProductAPI } from './api';
import { flatten } from 'ramda';
import { RemoveProductResponse } from './api/productsAPI';

export const onRemoveProducts = async (
  removeProductsStore: RemoveProductsStore,
) => {
  const result = await new RemoveProductTask(removeProductsStore).run();

  return result;
};

export class RemoveProductTask extends Task {
  removeProductsStore: RemoveProductsStore;

  constructor(removeProductsStore: RemoveProductsStore) {
    super();
    this.removeProductsStore = removeProductsStore;
  }

  async run(): Promise<void> {
    const productsJobIds = Object.keys(this.removeProductsStore.products);

    for (const jobId of productsJobIds) {
      const responses = await Promise.allSettled(
        this.removeProductsStore.products[jobId].map(product =>
          removeProductAPI(product),
        ),
      );

      this.updateProductsByResponses(responses, jobId);
    }
  }

  private updateProductsByResponses(
    responses: PromiseSettledResult<RemoveProductResponse>[],
    jobId: string,
  ) {
    const products = responses.map((response, index) => {
      const product = this.removeProductsStore.products[jobId][index];
      if (response.status === 'fulfilled') product.isRemoved = true;
      return product;
    });

    this.removeProductsStore.updateProductsByKey(jobId, products);
  }
}
