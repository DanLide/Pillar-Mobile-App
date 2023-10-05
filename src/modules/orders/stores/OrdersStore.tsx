import { action, makeObservable, observable, computed, override } from 'mobx';
import { isNil } from 'ramda';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';
import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';

export interface CurrentOrder extends Pick<GetOrderDetailsResponse, 'order'> {
  productList: ProductModel[];
}

const PRODUCT_MAX_COUNT = 9999;

export class OrdersStore extends BaseProductsStore {
  @observable currentOrder?: CurrentOrder;
  @observable orders?: GetOrdersAPIResponse[];
  @observable supplierId?: number;
  @observable currentStockName?: string;

  constructor() {
    super();

    this.orders = undefined;
    this.supplierId = undefined;
    makeObservable(this);
  }

  @computed get getCurrentProductsByStockName() {
    return this.currentOrder?.productList.filter(
      product => product.stockLocationName === this.currentStockName,
    );
  }

  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @computed get getOrders() {
    return this.orders;
  }

  @computed get getCurrentOrder() {
    return this.currentOrder;
  }

  @computed get isProductItemsMissing() {
    const isMissing = this.currentOrder?.productList.reduce((acc, item) => {
      if (
        isNil(item.orderedQty) ||
        isNil(item.receivedQty) ||
        isNil(item.reservedCount)
      )
        return acc;

      if (item.orderedQty - (item.receivedQty + item.reservedCount) !== 0)
        acc = true;
      return acc;
    }, false);
    return !!isMissing;
  }

  @action setCurrentOrder(orderDetails: CurrentOrder) {
    this.currentOrder = orderDetails;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }

  @action setCurrentOrderProducts(products: ProductModel[]) {
    if (this.currentOrder) {
      this.currentOrder.productList = products;
    }
  }

  @action setSelectedProductsByStock(stockName: string) {
    this.currentStockName = stockName;
  }

  @action updateCurrentOrderProduct(product: ProductModel) {
    const products = this.currentOrder?.productList.map(currentProduct => {
      if (product.productId === currentProduct.productId) {
        return product;
      }
      return currentProduct;
    });
    if (this.currentOrder && products) {
      this.currentOrder.productList = products;
    }
  }

  @action setSupplier(supplierId?: number) {
    this.supplierId = supplierId;
  }

  @action clearCreateOrder() {
    this.supplierId = undefined;
    this.clear();
  }
}
