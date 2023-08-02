import { Task } from './helpers';
import { ManageProductsStore } from '../modules/manageProducts/stores';
import { updateProductQuantityAPI } from './api/productsAPI';

export const onUpdateProduct = (manageProductsStore: ManageProductsStore) =>
  new UpdateProductTask(manageProductsStore).run();

export class UpdateProductTask extends Task {
  manageProductsStore: ManageProductsStore;

  constructor(manageProductsStore: ManageProductsStore) {
    super();
    this.manageProductsStore = manageProductsStore;
  }

  async run() {
    await updateProductQuantityAPI(
      this.manageProductsStore.getCurrentProduct,
      this.manageProductsStore.currentStock,
    );
  }
}
