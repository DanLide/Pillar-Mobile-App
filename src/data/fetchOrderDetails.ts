import { Task, TaskExecutor } from './helpers';
import { getOrderDetails, GetOrderDetailsResponse } from './api';

import { ordersStore } from '../modules/orders/stores';
import { OrderProductResponse } from './api/orders';
import { ProductModel } from '../stores/types';

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
      ordersStore.setCurrentOrder({
        order: this.getOrderDetailsContext.orderDetails.order,
        productList: this.mapResponse(
          this.getOrderDetailsContext.orderDetails.productList,
        ),
      });
    }
  }

  mapResponse(orderProducts: OrderProductResponse[]) {
    return orderProducts.map(orderProduct => {
      return {
        ...orderProduct,
        uuid: 'someStrign',
        isRemoved: false,
        reservedCount: undefined,
        nameDetails: '',
        isRecoverable: false,
      };
    });
  }
}
