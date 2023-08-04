import { Task } from './helpers';
import { ManageProductsStore } from '../modules/manageProducts/stores';
import { updateProductQuantityAPI } from './api/productsAPI';

export const onUpdateProduct = async (
  manageProductsStore: ManageProductsStore,
) => {
  try {
    await new UpdateProductTask(manageProductsStore).run();
  } catch (error) {
    return error;
  }
};

export class UpdateProductTask extends Task {
  manageProductsStore: ManageProductsStore;

  constructor(manageProductsStore: ManageProductsStore) {
    super();
    this.manageProductsStore = manageProductsStore;
  }

  async run() {
    const product = this.manageProductsStore.getCurrentProduct;

    if (product?.reservedCount === product?.onHand) return;

    await updateProductQuantityAPI(
      product,
      this.manageProductsStore.currentStock,
    );
  }
}
