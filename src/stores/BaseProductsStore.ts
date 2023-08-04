import { action, computed, makeObservable, observable } from 'mobx';
import { v1 as uuid } from 'uuid';
import { pipe, prop, sortBy, toLower, trim } from 'ramda';

import {
  ClearStoreType,
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from './types';
import { StockModel } from '../modules/stocksList/stores/StocksStore';
import { addProductByJob, getReservedCountById } from './helpers';
import { CategoryResponse, SupplierResponse } from '../data/api/productsAPI';

type BaseProductsStoreType = SyncedProductStoreType &
  StockProductStoreType &
  ScannerModalStoreType &
  CurrentProductStoreType &
  ClearStoreType;

export class BaseProductsStore implements BaseProductsStoreType {
  @observable currentStock?: StockModel;
  @observable products: ProductModel[];
  @observable currentProduct?: ProductModel;

  @observable categories: CategoryResponse[];
  @observable suppliers: SupplierResponse[];
  @observable enabledSuppliers: SupplierResponse[];

  constructor() {
    this.currentStock = undefined;
    this.currentProduct = undefined;
    this.products = [];
    this.categories = [];
    this.suppliers = [];
    this.enabledSuppliers = [];

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

  @computed get getOnHand() {
    return this.getMaxValue;
  }

  @computed get getEditableOnHand() {
    return this.getEditableMaxValue;
  }

  @computed get stockName() {
    return this.currentStock?.organizationName;
  }

  @computed
  get getProducts() {
    return this.products;
  }

  @computed get getCategories() {
    return this.categories;
  }

  @computed get getSuppliers() {
    return this.suppliers;
  }

  @computed get getEnabledSuppliers() {
    return this.enabledSuppliers;
  }

  @computed get getSortedProducts() {
    return sortBy(pipe(prop('name'), trim, toLower), this.products);
  }

  @computed
  get getSyncedProducts() {
    return this.getSortedProducts.filter(product => product.isRemoved);
  }

  @computed
  get getNotSyncedProducts() {
    return this.getSortedProducts.filter(product => !product.isRemoved);
  }

  @action removeCurrentProduct() {
    this.currentProduct = undefined;
  }

  @action setCurrentProduct(product?: ProductModel) {
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

  @action setCategories(categories: CategoryResponse[]) {
    this.categories = categories;
  }

  @action setSuppliers(suppliers: SupplierResponse[]) {
    this.suppliers = suppliers;
  }

  @action setEnabledSuppliers(suppliers: SupplierResponse[]) {
    this.enabledSuppliers = suppliers;
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = [];
    this.currentProduct = undefined;

    this.categories = [];
    this.suppliers = [];
    this.enabledSuppliers = [];
  }
}
