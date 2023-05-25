import { action, makeObservable, observable, computed } from 'mobx';
import { InventoryUseType } from '../../../constants/common.enum';

import { JobModel } from '../../jobsList/stores/JobsStore';
import { getProductMinQty } from '../../../data/helpers';

export interface ScanningProductModel {
  productId: number;
  name: string;
  nameDetails: string;
  isRecoverable: boolean;
  onHand: number;
  reservedCount: string;
  job?: JobModel;
  inventoryUseTypeId: InventoryUseType;
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
    product.reservedCount = String(
      getProductMinQty(product.inventoryUseTypeId),
    );
    this.currentProduct = product;
  }

  @action setProductReservedCount(count: string) {
    this.currentProduct!.reservedCount = count;
  }

  @action setProductJob(job: JobModel) {
    this.currentProduct!.job = job;
  }

  @action clear() {
    this.currentProduct = undefined;
  }
}
