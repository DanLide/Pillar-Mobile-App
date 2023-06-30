import { override } from 'mobx';

import { BaseProductsStore } from '../../../stores/BaseProductsStore';

const PRODUCT_MAX_COUNT = 999;

export class ReturnProductsStore extends BaseProductsStore {
  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }
}
