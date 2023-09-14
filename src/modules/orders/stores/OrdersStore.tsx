import { action, makeObservable, observable, computed } from 'mobx';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';
import { BaseProductsStore } from '../../../stores/BaseProductsStore';

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

  @action setCurrentOrder(orderDetails: GetOrderDetailsResponse) {
    this.currentOrder = orderDetails;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }
}
