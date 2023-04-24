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
  @observable removedProducts: RemoveProductsType;

  constructor() {
    this.currentStock = undefined;
    this.products = {};
    this.removedProducts = {};

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

  @action removeProduct(product: ScanningProductModel) {
    if (!product.jobId) {
      this.products = {
        ...this.products,
        ['-1']: this.products['-1'].filter(
          currentProduct =>
            currentProduct.productId === product.productId &&
            currentProduct.reservedCount === product.reservedCount,
        ),
      };
    } else {
      this.products = {
        ...this.products,
        [product.jobId]: this.products['-1'].filter(
          currentProduct =>
            currentProduct.productId === product.productId &&
            currentProduct.reservedCount === product.reservedCount,
        ),
      };
    }
  }

  @action addProductToRemovedList(product: ScanningProductModel) {
    if (!product.jobId) {
      this.removedProducts = {
        ...this.removedProducts,
        ['-1']: [...(this.removedProducts['-1'] || []), product],
      };
    } else {
      this.removedProducts = {
        ...this.removedProducts,
        [product.jobId]: [
          ...(this.removedProducts[product.jobId] || []),
          product,
        ],
      };
    }
  }

  @action clear() {
    this.currentStock = undefined;
    this.products = {};
    this.removedProducts = {};
  }
}
