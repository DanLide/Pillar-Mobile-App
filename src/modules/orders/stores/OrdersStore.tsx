import { action, makeObservable, observable, computed } from 'mobx';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';
import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { OrderProductResponse } from '../../../data/api/orders';

export class OrdersStore extends BaseProductsStore {
  @observable currentOrder?: GetOrderDetailsResponse;
  @observable orders?: GetOrdersAPIResponse[];

  constructor() {
    super();

    this.orders = undefined;
    makeObservable(this);
  }

  @computed get getOrders() {
    return this.orders;
  }

  @computed get getCurrentOrder() {
    return this.currentOrder;
  }

  @computed get isProductItemsMissing() {
    const isMissing = this.currentOrder?.productList.reduce((acc, item) => {
      if ((item.orderedQty - item.receivedQty) !== 0) acc = true;
      return acc;
    }, false);
    return !!isMissing;
  }

  @action setCurrentOrder(orderDetails: GetOrderDetailsResponse) {
    this.currentOrder = orderDetails;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }

  @action updateCurrentOrderProduct(product: OrderProductResponse) {
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
}
