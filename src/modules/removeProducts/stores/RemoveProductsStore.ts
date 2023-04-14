import { action, makeObservable, observable } from 'mobx';

import { StockModel } from '../../stocksList/stores/StocksStore';
import { ScanningProductModel } from './ScanningProductStore';

export type RemoveProductsType = Record<
  string | string,
  ScanningProductModel[]
>;

export class RemoveProductsStore {
  @observable currentStock?: StockModel;
  @observable products: RemoveProductsType;

  constructor() {
    this.currentStock = undefined;
    this.products = {};

    makeObservable(this);
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ScanningProductModel) {
    if (!product.jobId) {
      this.products = {
        ...this.products,
        ['-1']: [...(this.products['-1'] || []), product],
      };
    } else {
      this.products = {
        ...this.products,
        [product.jobId]: [...(this.products[product.jobId] || []), product],
      };
    }
  }

  @action clear() {
    this.currentStock = undefined;
  }
}
