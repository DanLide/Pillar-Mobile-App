import { action, override, computed } from 'mobx';

import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';
import { getReservedCountById } from '../../../stores/helpers';
import { JobModel } from '../../jobsList/stores/JobsStore';

const PRODUCT_MAX_COUNT = 9999;

export class CreateInvoiceStore extends BaseProductsStore {
  currentJob?: JobModel;

  constructor() {
    super();
    this.currentJob = undefined;
  }

  @computed get getCurrentJob() {
    return this.currentJob;
  }

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

  @action setCurrentJob(job: JobModel) {
    this.currentJob = job;
  }
}
