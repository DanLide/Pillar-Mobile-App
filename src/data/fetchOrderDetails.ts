import { Task, TaskExecutor } from './helpers';
import { getOrderDetails, GetOrderDetailsResponse } from './api';

import { ordersStore } from '../modules/orders/stores';

interface GetOrderDetailsContext {
  orderDetails?: GetOrderDetailsResponse;
}

export const fetchOrderDetails = async (orderId: string) => {
  const getOrderDetailsContext: GetOrderDetailsContext = {
    orderDetails: undefined,
  };
  const result = await new TaskExecutor([
    new GetOrderDetailsTask(getOrderDetailsContext, orderId),
    new SaveOrdersToStoreTask(getOrderDetailsContext),
  ]).execute();

  return result;
};

export class GetOrderDetailsTask extends Task {
  getOrderDetailsContext: GetOrderDetailsContext;
  orderId: string;

  constructor(getOrderDetailsContext: GetOrderDetailsContext, orderId: string) {
    super();
    this.getOrderDetailsContext = getOrderDetailsContext;
    this.orderId = orderId;
  }

  async run(): Promise<void> {
    const response = await getOrderDetails(this.orderId);
    this.getOrderDetailsContext.orderDetails = response;
  }
}

export class SaveOrdersToStoreTask extends Task {
  getOrderDetailsContext: GetOrderDetailsContext;

  constructor(getOrderDetailsContext: GetOrderDetailsContext) {
    super();
    this.getOrderDetailsContext = getOrderDetailsContext;
  }

  async run(): Promise<void> {
    if (this.getOrderDetailsContext.orderDetails) {
      ordersStore.setCurrentOrder(this.getOrderDetailsContext.orderDetails);
    }
  }
}
