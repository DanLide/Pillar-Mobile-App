import { action, makeObservable, observable, computed } from 'mobx';
import { v1 as uuid } from 'uuid';

import { StockModel } from '../../stocksList/stores/StocksStore';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
  ClearStoreType,
  ProductModel,
} from '../../../stores/types';
import { getReservedCountById, addProductByJob } from '../helpers';

type RemoveProductsStoreType = SyncedProductStoreType &
  StockProductStoreType &
  ScannerModalStoreType &
  CurrentProductStoreType &
  ClearStoreType;

export class RemoveProductsStore implements RemoveProductsStoreType {
  @observable currentStock?: StockModel;
  @observable products: ProductModel[];
  @observable currentProduct?: ProductModel;

  constructor() {
    this.currentStock = undefined;
    this.currentProduct = undefined;
    this.products = [];

    makeObservable(this);
  }

  @computed get getCurrentProduct() {
    return this.currentProduct;
  }

  @computed get getScannedProductsCountByProductId() {
    return (productId: number) =>
      getReservedCountById(this.getProducts, productId);
  }

  @computed get getMaxValue() {
    return (product: ProductModel) =>
      product.onHand -
      getReservedCountById(this.getProducts, product.productId);
  }

  @computed get getEditableMaxValue() {
    return (product: ProductModel) =>
      product.onHand -
      getReservedCountById(this.getProducts, product.productId) +
      product.reservedCount;
  }

  @computed get stockName() {
    return this.currentStock?.organizationName;
  }

  @computed
  get getProducts() {
    return this.products;
  }

  @computed
  get getSyncedProducts() {
    return this.products.filter(product => product.isRemoved);
  }

  @computed
  get getNotSyncedProducts() {
    return this.products.filter(product => !product.isRemoved);
  }

  @action removeCurrentProduct() {
    this.currentProduct = undefined;
  }

  @action setCurrentProduct(product: ProductModel) {
    this.currentProduct = product;
  }

  @action setEditableProductQuantity(reservedCount: number) {
    if (this.currentProduct)
      this.currentProduct = { ...this.currentProduct, reservedCount };
  }

  @action updateProduct(product: ProductModel) {
    this.products = this.products.map(currentProduct =>
      currentProduct.uuid === product.uuid ? product : currentProduct,
    );
  }

  @action removeProduct(product: ProductModel) {
    this.products = this.products.filter(
      currentProduct => currentProduct.uuid !== product.uuid,
    );
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ProductModel) {
    const removedProduct = { ...product, isRemoved: false, uuid: uuid() };
    this.products = addProductByJob(removedProduct, this.products);
  }

  @action setProducts(products: ProductModel[]) {
    this.products = products;
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = [];
    this.currentProduct = undefined;
  }
}
