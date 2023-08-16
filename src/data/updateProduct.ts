import { Task } from './helpers';
import { ManageProductsStore } from '../modules/manageProducts/stores';
import {
  updateProductAreaSettingsAPI,
  updateProductQuantityAPI,
  updateProductSettingsAPI,
} from './api/productsAPI';
import { ssoStore } from '../stores';

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
    const viewProduct = this.manageProductsStore.getCurrentProduct;
    const editProduct = this.manageProductsStore.updatedProduct;

    const stockId = this.manageProductsStore.currentStock?.partyRoleId;
    const facilityId = ssoStore.getCurrentSSO?.pisaId;

    await Promise.all([
      updateProductQuantityAPI(
        viewProduct,
        this.manageProductsStore.currentStock,
      ),
      updateProductSettingsAPI(editProduct),
      updateProductAreaSettingsAPI(editProduct, stockId, facilityId),
    ]);
  }
}
