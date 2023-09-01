import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { action, computed, makeObservable, observable, override } from 'mobx';
import { ProductModel } from '../../../stores/types';
import { v1 as uuid } from 'uuid';
import { addProductToList } from '../helpers';
import { equals } from 'ramda';

const PRODUCT_MAX_COUNT = 9999;

export class ManageProductsStore extends BaseProductsStore {
  @observable updatedProduct?: ProductModel;

  constructor() {
    super();

    this.updatedProduct = undefined;

    makeObservable(this);
  }

  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override addProduct(product: ProductModel) {
    const scannedProduct = { ...product, isRemoved: false, uuid: uuid() };
    this.products = addProductToList(scannedProduct, this.products);
  }

  @computed get isProductChanged(): boolean {
    return (
      this.currentProduct?.reservedCount !== this.currentProduct?.onHand ||
      (!!this.updatedProduct &&
        !equals(this.updatedProduct, this.currentProduct))
    );
  }

  @action setUpdatedProduct(product?: ProductModel) {
    this.updatedProduct = product;
  }

  @action setOnHand(reservedCount: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, reservedCount };
  }

  @action setInventoryType(inventoryUseTypeId: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, inventoryUseTypeId };
  }

  @action setCategory(categoryId: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, categoryId };
  }

  @action setMinValue(min: number) {
    if (!this.updatedProduct) return;

    const maxValue = this.updatedProduct.max ?? 0;

    const max = min >= maxValue ? min : maxValue;

    this.updatedProduct = { ...this.updatedProduct, min, max };
  }

  @action setMaxValue(max: number) {
    if (!this.updatedProduct) return;

    const minValue = this.updatedProduct.min ?? 0;

    const min = max <= minValue ? max : minValue;

    this.updatedProduct = { ...this.updatedProduct, max, min };
  }

  @action setUnitsPerContainer(unitsPerContainer: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, unitsPerContainer };
  }

  @action setOrderMultiple(orderMultiple: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, orderMultiple };
  }

  @action setOnOrder(onOrder: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, onOrder };
  }

  @action setSupplier(supplierPartyRoleId: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, supplierPartyRoleId };
  }

  @action setRestockFrom(replenishedFormId: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, replenishedFormId };
  }

  @action toggleIsRecoverable() {
    if (!this.updatedProduct) return;

    this.updatedProduct = {
      ...this.updatedProduct,
      isRecoverable: !this.updatedProduct.isRecoverable,
    };
  }

  @action setUpc(upc: string) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, upc };
  }
}
