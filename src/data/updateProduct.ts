import { Task, TaskExecutor } from './helpers';
import { ManageProductsStore } from '../modules/manageProducts/stores';
import {
  updateProductAreaSettingsAPI,
  updateProductOrderMultipleAPI,
  updateProductQuantityAPI,
  updateProductSettingsAPI,
} from './api/productsAPI';
import { ssoStore } from '../stores';
import { difference, isEmpty } from 'ramda';

export const onUpdateProduct = async (
  manageProductsStore: ManageProductsStore,
) => {
  try {
    await new UpdateProductTask(manageProductsStore).run();
    await new TaskExecutor([
      new UpdateProductTask(manageProductsStore),
      new SaveUpdateProductToStore(manageProductsStore),
    ]).execute();
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
    const currentProduct = this.manageProductsStore.getCurrentProduct;
    const updatedProduct = this.manageProductsStore.updatedProduct;

    const stockId = this.manageProductsStore.currentStock?.partyRoleId;
    const facilityId = ssoStore.getCurrentSSO?.pisaId;

    const shouldUpdateQuantity =
      updatedProduct?.reservedCount !== updatedProduct?.onHand;

    const shouldUpdateSettings = difference(
      [
        updatedProduct?.upc,
        updatedProduct?.inventoryUseTypeId,
        updatedProduct?.unitsPerContainer,
        updatedProduct?.supplierPartyRoleId,
        updatedProduct?.categoryId,
        updatedProduct?.isRecoverable,
      ],
      [
        currentProduct?.upc,
        currentProduct?.inventoryUseTypeId,
        currentProduct?.unitsPerContainer,
        currentProduct?.supplierPartyRoleId,
        currentProduct?.categoryId,
        currentProduct?.isRecoverable,
      ],
    );

    const shouldUpdateAreaSettings = difference(
      [
        updatedProduct?.min,
        updatedProduct?.max,
        updatedProduct?.replenishedFormId,
      ],
      [
        currentProduct?.min,
        currentProduct?.max,
        currentProduct?.replenishedFormId,
      ],
    );

    const shouldUpdateOrderMultiple =
      updatedProduct?.orderMultiple !== currentProduct?.orderMultiple;

    await Promise.all([
      shouldUpdateQuantity &&
        updateProductQuantityAPI(
          updatedProduct,
          this.manageProductsStore.currentStock,
        ),
      !isEmpty(shouldUpdateSettings) &&
        updateProductSettingsAPI(updatedProduct),
      !isEmpty(shouldUpdateAreaSettings) &&
        updateProductAreaSettingsAPI(updatedProduct, stockId, facilityId),
      shouldUpdateOrderMultiple &&
        updateProductOrderMultipleAPI(updatedProduct, stockId),
    ]);
  }
}

export class SaveUpdateProductToStore extends Task {
  manageProductsStore: ManageProductsStore;

  constructor(manageProductsStore: ManageProductsStore) {
    super();
    this.manageProductsStore = manageProductsStore;
  }

  async run() {
    this.manageProductsStore.setCurrentProduct(
      this.manageProductsStore.updatedProduct,
    );
  }
}
