import { Task, TaskExecutor } from './helpers';
import { ManageProductsStore } from '../modules/manageProducts/stores';
import {
  updateProductAreaSettingsAPI,
  updateProductOrderMultipleAPI,
  updateProductQuantityAPI,
  updateProductSettingsAPI,
} from './api/productsAPI';
import { ssoStore } from '../stores';
import { equals } from 'ramda';
import { stocksStore } from '../modules/stocksList/stores';

export const onUpdateProduct = async (
  manageProductsStore: ManageProductsStore,
) =>
  new TaskExecutor([
    new UpdateProductTask(manageProductsStore),
    new SaveUpdateProductToStore(manageProductsStore),
  ]).execute();

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

    const shouldUpdateSettings = !equals(
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

    const shouldUpdateAreaSettings = !equals(
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

    if (shouldUpdateOrderMultiple) {
      await updateProductOrderMultipleAPI(updatedProduct);
    }

    if (shouldUpdateSettings) {
      await updateProductSettingsAPI(updatedProduct);
    }

    await Promise.allSettled([
      shouldUpdateQuantity &&
        updateProductQuantityAPI(
          updatedProduct,
          this.manageProductsStore.currentStock,
        ),
      shouldUpdateAreaSettings &&
        updateProductAreaSettingsAPI(updatedProduct, stockId, facilityId),
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
    if (!this.manageProductsStore.updatedProduct) return;

    const updatedProduct = {
      ...this.manageProductsStore.updatedProduct,
      onHand: this.manageProductsStore.updatedProduct.reservedCount ?? 0,
    };

    stocksStore.updateFacilityProduct(updatedProduct);
    this.manageProductsStore.setCurrentProduct(updatedProduct);
    this.manageProductsStore.setUpdatedProduct(updatedProduct);
  }
}
