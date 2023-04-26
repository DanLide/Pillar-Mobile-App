import { action, makeObservable, observable, computed } from 'mobx';

import { StockModel } from '../../stocksList/stores/StocksStore';
import { ScanningProductModel } from './ScanningProductStore';

interface RemoveProductModel extends ScanningProductModel {
  isRemoved: boolean;
}

export type RemoveProductsType = Record<string | string, RemoveProductModel[]>;

export class RemoveProductsStore {
  @observable currentStock?: StockModel;
  @observable products: RemoveProductsType;

  constructor() {
    this.currentStock = undefined;
    this.products = {};

    makeObservable(this);
  }

  @computed
  get getRemovedProducts() {
    const products = Object.keys(this.products).reduce((acc, jobId) => {
      const removedProducts = this.products[jobId].filter(
        product => product.isRemoved === true,
      );
      if (removedProducts.length > 0) {
        return {
          ...acc,
          [jobId]: removedProducts,
        };
      } else {
        return acc;
      }
    }, {});

    return products;
  }

  @action setCurrentStocks(stock: StockModel) {
    this.currentStock = stock;
  }

  @action addProduct(product: ScanningProductModel) {
    if (!product.jobId) {
      this.products = {
        ...this.products,
        ['-1']: [
          ...(this.products['-1'] || []),
          { ...product, isRemoved: false },
        ],
      };
    } else {
      this.products = {
        ...this.products,
        [product.jobId]: [
          ...(this.products[product.jobId] || []),
          { ...product, isRemoved: false },
        ],
      };
    }
  }

  @action updateProductsByKey(key: string, products: RemoveProductModel[]) {
    this.products = { ...this.products, [key]: products };
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = {};
  }
}
