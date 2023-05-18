import { action, makeObservable, observable, computed } from 'mobx';

import { StockModel } from '../../stocksList/stores/StocksStore';
import { ScanningProductModel } from './ScanningProductStore';

export interface RemoveProductModel extends ScanningProductModel {
  isRemoved: boolean;
}

export class RemoveProductsStore {
  @observable currentStock?: StockModel;
  @observable products: RemoveProductModel[];

  constructor() {
    this.currentStock = undefined;
    this.products = [];

    makeObservable(this);
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

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ScanningProductModel) {
    const removedProduct = { ...product, isRemoved: false };
    this.products = [...this.products, removedProduct];
  }

  @action setProducts(products: RemoveProductModel[]) {
    this.products = products;
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = [];
  }
}
