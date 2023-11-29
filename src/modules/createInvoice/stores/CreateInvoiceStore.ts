import { action, override, computed } from 'mobx';

import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';
import { getReservedCountById } from '../../../stores/helpers';
import { JobModel } from '../../jobsList/stores/JobsStore';

const PRODUCT_MAX_COUNT = 9999;

export class CreateInvoiceStore extends BaseProductsStore {
  currentJob?: JobModel;
  facilityProducts: ProductModel[];
  currentProduct?: ProductModel;

  constructor() {
    super();
    this.currentJob = undefined;
    this.facilityProducts = [];
    this.currentProduct = undefined;
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

  @computed get getProductById() {
    return (productId: number) =>
      this.facilityProducts.find(product => product.productId === productId);
  }

  @override get getEditableOnHand() {
    return (product: ProductModel) =>
      product.onHand +
      getReservedCountById(this.getProducts, product.productId) -
      (product.reservedCount || 0);
  }

  @action setCurrentJob(job: JobModel) {
    this.currentJob = job;
  }

  @action setFacilityProducts(products: ProductModel[]) {
    this.facilityProducts = this.mapProducts(products);
  }

  mapProducts(products: ProductModel[]) {
    return products.map(product => ({
      ...product,
      isRecoverable: product.isRecoverable === 'Yes',
    }));
  }
}
