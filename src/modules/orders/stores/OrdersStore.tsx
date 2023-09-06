import { action, makeObservable, observable, computed } from 'mobx';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';

export class OrdersStore {
  @observable currentOrder?: GetOrderDetailsResponse;
  @observable orders?: GetOrdersAPIResponse[];

  constructor() {
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
