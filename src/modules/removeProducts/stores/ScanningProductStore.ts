import { action, makeObservable, observable, computed } from 'mobx';
import { InventoryUseType } from '../../../constants/common.enum';

import { JobModel } from '../../jobsList/stores/JobsStore';

export interface ScanningProductModel {
  productId: number;
  name: string;
  nameDetails: string;
  isRecoverable: boolean;
  onHand: number;
  reservedCount: number;
  job?: JobModel;
  inventoryUseType: InventoryUseType;
  size: string;
  partNo: string;
  manufactureCode: string;
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
    this.currentProduct = product;
  }

  @action setProductReservedCount(count: number) {
    this.currentProduct!.reservedCount = count;
  }

  @action setProductJob(job: JobModel) {
    this.currentProduct!.job = job;
  }

  @action clear() {
    this.currentProduct = undefined;
  }
}
