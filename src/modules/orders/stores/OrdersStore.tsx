import { action, makeObservable, observable, computed } from 'mobx';

import { GetOrdersAPIResponse } from '../../../data/api';

export class OrdersStore {
  @observable orders?: GetOrdersAPIResponse[];

  constructor() {
    this.orders = undefined;
    makeObservable(this);
  }

  @computed get getOrders() {
    return this.orders;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }
}
