import { override } from 'mobx';

import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';
import { getReservedCountById } from '../../../stores/helpers';

const PRODUCT_MAX_COUNT = 9999;

export class ReturnProductsStore extends BaseProductsStore {
  @override get getMaxValue() {
    return (product: ProductModel) =>
      (this.productJobs[product.productId] &&
        this.productJobs[product.productId][0]?.qty) ||
      PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => {
      return this.currentProduct?.job?.qty || PRODUCT_MAX_COUNT;
    };
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
