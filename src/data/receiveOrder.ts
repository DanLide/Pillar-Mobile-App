import { clone } from 'ramda';

import { Task } from './helpers';
import {
  receiveOrderAPI,
  getOrderSummaryDetailsAPI,
  getOrderStorageAreaAPI,
} from './api';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import { GetOrderSummaryProduct } from './api/orders';
import { TransactionType } from '../constants/common.enum';

interface ReceiveOrderContext {
  orderProductsByArea: GetOrderSummaryProduct[][];
}

export const receiveOrder = async (ordersStore: OrdersStore) => {
  const context: ReceiveOrderContext = {
    orderProductsByArea: [],
  };
  try {
    await new FetchOrderSummaryDetails(ordersStore, context).run();
    await new ReceiveProductTask(ordersStore, context).run();
  } catch (error) {
    return error;
  }
};

class FetchOrderSummaryDetails extends Task {
  ordersStore: OrdersStore;
  context: ReceiveOrderContext;
  hasError: boolean;

  constructor(ordersStore: OrdersStore, context: ReceiveOrderContext) {
    super();
    this.ordersStore = ordersStore;
    this.context = context;
    this.hasError = false;
  }

  async run() {
    if (!this.ordersStore.currentOrder?.order) throw Error('Request failed!');
    const { orderId } = this.ordersStore.currentOrder.order;
    const storages = await getOrderStorageAreaAPI(orderId);

    if (storages) {
      for (const storage of storages) {
        const response = await getOrderSummaryDetailsAPI(
          orderId,
          storage.partyRoleId,
        );
        if (response?.productList) {
          this.context.orderProductsByArea.push(response.productList);
        } else {
          throw Error('Request failed!');
        }
      }
    }
  }
}

class ReceiveProductTask extends Task {
  context: ReceiveOrderContext;
  ordersStore: OrdersStore;
  hasError: boolean;

  constructor(ordersStore: OrdersStore, context: ReceiveOrderContext) {
    super();
    this.ordersStore = ordersStore;
    this.context = context;
    this.hasError = false;
  }

  async run() {
    const currentOrderProducts = clone(
      this.ordersStore.currentOrder?.productList,
    );
    const { orderProductsByArea } = this.context;

    if (
      !currentOrderProducts?.length ||
      typeof this.ordersStore.currentOrder?.order.customPONumber !== 'string'
    )
      throw Error('Request failed!');

    for (const products of orderProductsByArea) {
      const requestProduct = products.map((product: GetOrderSummaryProduct) => {
        const receivedQty = currentOrderProducts.find(
          orderProduct => orderProduct.productId === product.productId,
        );

        if (
          typeof receivedQty?.receivedQty !== 'number' ||
          !this.ordersStore.currentOrder?.order.customPONumber
        )
          throw Error('Request failed!');
        return {
          number: this.ordersStore.currentOrder?.order.customPONumber,
          orderDetailId: product.orderDetailId,
          partyRoleId: product.storageAreaId,
          productId: product.productId,
          transactionTypeId: TransactionType.Order,
          unitCost: product.cost,
          quantityReceived: receivedQty.receivedQty - product.receivedQty,
        };
      });

      await receiveOrderAPI(requestProduct);
    }
  }
}
