import { action, makeObservable, observable, computed } from 'mobx';

export interface ScanningProductModel {
  productId: number;
  name: string;
  nameDetails: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
  reservedCount: number;
  jobId?: number;
}

export class ScanningProductStore {
  @observable currentProduct?: ScanningProductModel;

  constructor() {
    this.currentProduct = undefined;

    makeObservable(this);
  }

  @computed get getCurrentProduct() {
    return this.currentProduct;
  }

  @action setCurrentProduct(product: ScanningProductModel) {
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
