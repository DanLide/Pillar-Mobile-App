import { action, makeObservable, observable, computed } from 'mobx';
import { InventoryUseType } from '../../../constants/common.enum';

export interface ScanningProductModel {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
  reservedCount: number;
  jobId?: number;
  inventoryUseTypeId: InventoryUseType;
  size: string;
  partNo: string;
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
