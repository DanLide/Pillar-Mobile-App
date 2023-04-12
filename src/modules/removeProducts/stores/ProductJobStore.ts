import { action, makeObservable, observable, computed } from 'mobx';
import { ProductModel } from '../../../data/api/productsAPI';

export interface ProductJobModel extends ProductModel {
  reservedCount?: number;
  jobId?: number;
}

export class ProductJobStore {
  @observable currentProduct?: ProductJobModel;

  constructor() {
    this.currentProduct = undefined;

    makeObservable(this);
  }

  @computed public get isProductRecoverable() {
    return this.currentProduct?.isRecoverable === 'Yes';
  }

  @computed public get currentProductReservedCount() {
    return this.currentProduct?.reservedCount === undefined
      ? 1
      : this.currentProduct?.reservedCount;
  }

  @action setCurrentProduct(product: ProductJobModel) {
    product.reservedCount = 1;
    this.currentProduct = product;
  }

  @action setProductReservedCount(count: string | number) {
    this.currentProduct!.reservedCount = +count;
  }

  @action setProductJob(jobId: number) {
    this.currentProduct!.jobId = jobId;
  }

  @action clear() {
    this.currentProduct = undefined;
  }
}
