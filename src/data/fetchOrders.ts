import { Task, TaskExecutor } from './helpers';
import { GetOrdersAPIResponse, getOrdersAPI } from './api';

import { ordersStore } from '../modules/orders/stores';

interface GetOrdersContext {
  orders?: GetOrdersAPIResponse[];
}

export const fetchOrders = async () => {
  const getOrdersContext: GetOrdersContext = {
    orders: undefined,
  };
  const result = await new TaskExecutor([
    new GetOrdersTask(getOrdersContext),
    new SaveOrdersToStoreTask(getOrdersContext),
  ]).execute();

  return result;
};

export class GetOrdersTask extends Task {
  getOrdersContext: GetOrdersContext;

  constructor(getOrdersContext: GetOrdersContext) {
    super();
    this.getOrdersContext = getOrdersContext;
  }

  async run(): Promise<void> {
    const response = await getOrdersAPI();
    this.getOrdersContext.orders = response;
  }
}

export class SaveOrdersToStoreTask extends Task {
  getOrdersContext: GetOrdersContext;

  constructor(getOrdersContext: GetOrdersContext) {
    super();
    this.getOrdersContext = getOrdersContext;
  }

  async run(): Promise<void> {
    if (this.getOrdersContext.orders) {
      ordersStore.setOrders(this.getOrdersContext.orders);
    }
  }
}
