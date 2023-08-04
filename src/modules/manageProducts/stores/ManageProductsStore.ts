import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { override } from 'mobx';

const PRODUCT_MAX_COUNT = 9999;

export class ManageProductsStore extends BaseProductsStore {
  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }
}
