import { action, computed, makeObservable, observable, override } from 'mobx';
import { v1 as uuid } from 'uuid';
import { equals } from 'ramda';

import { BaseProductsStore } from 'src/stores/BaseProductsStore';
import { ProductModel } from 'src/stores/types';
import { addProductToList } from '../helpers';
import { InventoryUseType } from 'src/constants/common.enum';

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
    const scannedProduct = {
      ...product,
      onHand: product.reservedCount ?? product.onHand,
      isRemoved: false,
      uuid: uuid(),
    };

    this.products = addProductToList(scannedProduct, this.products);
  }

  @override clear() {
    this.currentStock = undefined;
    this.products = [];
    this.currentProduct = undefined;
    this.updatedProduct = undefined;
  }

  @computed get isProductChanged(): boolean {
    return (
      this.currentProduct?.reservedCount !== this.currentProduct?.onHand ||
      (!!this.updatedProduct &&
        !equals(this.updatedProduct, this.currentProduct))
    );
  }

  @computed get isUpcChanged(): boolean {
    return !equals(this.updatedProduct?.upc, this.currentProduct?.upc);
  }

  @action setUpdatedProduct(product?: ProductModel) {
    this.updatedProduct = product;
  }

  @action removeUpdatedProduct() {
    this.updatedProduct = undefined;
  }

  @action setOnHand(reservedCount: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, reservedCount };
  }

  @action setInventoryType(inventoryUseTypeId: number) {
    if (!this.updatedProduct) return;

    const isEachPeace = inventoryUseTypeId === InventoryUseType.Each;
    const isContainer = inventoryUseTypeId === InventoryUseType.Container;

    this.updatedProduct = {
      ...this.updatedProduct,
      ...(isEachPeace && {
        unitsPerContainer: this.updatedProduct.unitPer || 0,
        min: 0,
        max: this.updatedProduct.unitPer,
      }),
      ...(isContainer && {
        min: 1,
        max: 1,
      }),
      inventoryUseTypeId,
      reservedCount: 0,
    };
  }

  @action setCategory(categoryId: number) {
    if (!this.updatedProduct) return;

    this.updatedProduct = { ...this.updatedProduct, categoryId };
  }

  @action setMinValue(min: number) {
    if (!this.updatedProduct) return;

    let max;
    const isEachPeace =
      this.updatedProduct.inventoryUseTypeId === InventoryUseType.Each;
    const currentMaxValue = this.updatedProduct.max ?? 0;
    const minMaxValue = Math.max(
      0,
      min + (this.updatedProduct.unitsPerContainer ?? 0) - 1,
    );

    if (isEachPeace) {
      max = currentMaxValue >= minMaxValue ? currentMaxValue : minMaxValue;
    } else {
      max = currentMaxValue >= min ? currentMaxValue : min;
    }

    this.updatedProduct = { ...this.updatedProduct, min, max };
  }

  @action setMaxValue(max: number) {
    if (!this.updatedProduct) return;

    let min;
    const isEachPeace =
      this.updatedProduct.inventoryUseTypeId === InventoryUseType.Each;
    const currentMinValue = this.updatedProduct.min ?? 0;
    const isMaxDecrements = (this.updatedProduct.max ?? 0) > max;
    const maxMinValue = Math.max(
      0,
      max - (this.updatedProduct.unitsPerContainer ?? 0) + 1,
    );

    if (isEachPeace && isMaxDecrements) {
      min = currentMinValue <= maxMinValue ? currentMinValue : maxMinValue;
    } else {
      min = currentMinValue <= max ? currentMinValue : max;
    }

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
