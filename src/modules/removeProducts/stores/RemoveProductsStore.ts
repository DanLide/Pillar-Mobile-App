import { action, makeObservable, observable } from 'mobx';

import { StockModel } from '../../stocksList/stores/StocksStore';
import { ProductJobModel } from './ProductJobStore';

export class RemoveProductsStore {
  @observable currentStock?: StockModel;
  @observable products: ProductJobModel[];

  constructor() {
    this.currentStock = undefined;
    this.products = [];

    makeObservable(this);
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ProductJobModel) {
    this.products.push(product);
  }

  @action clear() {
    this.currentStock = undefined;
  }
}
