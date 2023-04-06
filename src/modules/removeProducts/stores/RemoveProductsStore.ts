import { action, makeObservable, observable } from 'mobx';

import { StockModel } from '../../stocksList/stores/StocksStore';

export class RemoveProductsStore {
  @observable currentStock?: StockModel;

  constructor() {
    this.currentStock = undefined;

    makeObservable(this);
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action clear() {
    this.currentStock = undefined;
  }
}
