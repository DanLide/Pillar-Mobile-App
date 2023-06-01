import { action, makeObservable, observable, computed } from 'mobx';
import { v1 as uuid } from 'uuid';

import { StockModel } from '../../stocksList/stores/StocksStore';
import { ScanningProductModel } from './ScanningProductStore';
import { addProductToList } from '../helpers';

export interface RemoveProductModel extends ScanningProductModel {
  uuid: string;
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

  @action updateProduct(product: RemoveProductModel) {
    this.products = this.products.map(currentProduct =>
      currentProduct.uuid === product.uuid ? product : currentProduct,
    );
  }

  @action removeProduct(product: RemoveProductModel) {
    this.products = this.products.filter(
      currentProduct => currentProduct.uuid !== product.uuid,
    );
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ScanningProductModel) {
    const removedProduct = { ...product, isRemoved: false, uuid: uuid() };
    this.products = addProductToList(removedProduct, this.products);
  }

  @action setProducts(products: RemoveProductModel[]) {
    this.products = products;
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = [];
  }
}
