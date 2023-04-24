import { Task, TaskExecutor } from './helpers';
import { RemoveProductsStore } from '../modules/removeProducts/stores';
import { removeProductAPI } from './api';
import { flatten } from 'ramda';

export const onRemoveProducts = async (
  removeProductsStore: RemoveProductsStore,
) => {
  const result = await new TaskExecutor([
    new RemoveProductTask(removeProductsStore),
  ]).execute();

  return result;
};

export class RemoveProductTask extends Task {
  removeProductsStore: RemoveProductsStore;

  constructor(removeProductsStore: RemoveProductsStore) {
    super();
    this.removeProductsStore = removeProductsStore;
  }

  async run(): Promise<void> {
    await this.recurseRequest(this.removeProductsStore);
  }

  private async recurseRequest(
    removeProductsStore: RemoveProductsStore,
    position = 1,
  ) {
    const products = flatten(Object.values(removeProductsStore.products));
    const product = products[0];

    await removeProductAPI(product);
    this.removeProductsStore.addProductToRemovedList(product);

    if (products.length > position) {
      this.recurseRequest(removeProductsStore, (position = position + 1));
    }
  }
}
