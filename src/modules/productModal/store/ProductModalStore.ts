import { action, makeObservable, observable } from 'mobx';
import { ScanningProductModel } from '../../removeProducts/stores/ScanningProductStore';

interface ProductModal {
  product?: ScanningProductModel;
}

export class ProductModalStore implements ProductModal {
  @observable product?: ScanningProductModel;

  constructor() {
    makeObservable(this);
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
