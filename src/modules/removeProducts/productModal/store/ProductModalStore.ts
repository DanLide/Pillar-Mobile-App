import { action, makeObservable, observable, computed } from 'mobx';
import { InventoryTypeName } from '../../../../constants/common.enum';

import { ScanningProductModel } from '../../stores/ScanningProductStore';

interface ProductModal {
  product?: ScanningProductModel;
}

export class ProductModalStore implements ProductModal {
  @observable product?: ScanningProductModel;

  constructor() {
    makeObservable(this);
  }

  @computed get userTypeName() {
    if (!this.product) return undefined;

    return InventoryTypeName[this.product.inventoryUseTypeId];
  }

  @computed get getProduct() {
    return this.product;
  }

  @action setProduct(product: ScanningProductModel) {
    this.product = product;
  }

  @action updateQuantity(quantity: number) {
    this.product!.reservedCount = quantity;
  }

  @action clear() {
    this.product = undefined;
  }
}
