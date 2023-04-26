import { action, makeObservable, observable, computed } from 'mobx';
import { InventoryUseType } from '../../../constants/common.enum';

import { ScanningProductModel } from '../../removeProducts/stores/ScanningProductStore';

interface ProductModal {
  product?: ScanningProductModel;
}

export class ProductModalStore implements ProductModal {
  @observable product?: ScanningProductModel;

  constructor() {
    makeObservable(this);
  }

  @computed get userTypeName () {
    return InventoryUseType[this.product?.inventoryUseTypeId] || ''
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
