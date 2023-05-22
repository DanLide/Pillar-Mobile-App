import { action, makeObservable, observable, computed } from 'mobx';

import { ScanningProductModel } from '../../removeProducts/stores/ScanningProductStore';

interface ProductModal {
  product?: ScanningProductModel;
}

export class ProductModalStore implements ProductModal {
  @observable product?: ScanningProductModel;

  constructor() {
    makeObservable(this);
  }

  @computed get getProduct() {
    return this.product;
  }

  @action setProduct(product: ScanningProductModel) {
    this.product = product;
  }

  @action updateQuantity(quantity: number | string) {
    this.product!.reservedCount = quantity;
  }

  @action clear() {
    this.product = undefined;
  }
}
