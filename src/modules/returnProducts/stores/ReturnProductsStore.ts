import { override } from 'mobx';

import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';
import { getReservedCountById } from '../../../stores/helpers';

const PRODUCT_MAX_COUNT = 9999;

export class ReturnProductsStore extends BaseProductsStore {
  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getOnHand() {
    return (product: ProductModel) =>
      product.onHand +
      getReservedCountById(this.getProducts, product.productId);
  }

  @override get getEditableOnHand() {
    return (product: ProductModel) =>
      product.onHand +
      getReservedCountById(this.getProducts, product.productId) -
      product.reservedCount;
  }
}
