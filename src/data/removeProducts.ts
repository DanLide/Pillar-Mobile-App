import { clone } from 'ramda';

import { Task } from './helpers';
import { RemoveProductsStore } from '../modules/removeProducts/stores';
import { removeProductAPI } from './api';

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
    const products = clone(this.removeProductsStore.getProducts);

    for (const product of products) {
      if (!product.isRemoved) {
        try {
          await removeProductAPI(product);
          product.isRemoved = true;
        } catch (error) {
          this.hasError = true;
        }
      }
    }

    this.removeProductsStore.saveProducts(products);

    if (this.hasError) throw Error('Request failed!');
  }
}
