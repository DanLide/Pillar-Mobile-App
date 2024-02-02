import { Task, TaskExecutor } from './helpers';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrdersAPIResponse,
  OrderDetailsProduct,
  receiveBackOrderAPI,
} from 'src/data/api/orders';
import { ProductModel } from 'src/stores/types';
import { OrderMethodType, OrderType } from 'src/constants/common.enum';
import { SSOStore } from 'src/stores/SSOStore';
import { ssoStore } from 'src/stores';

interface CreateOrderContext {
  orderResponse?: GetOrdersAPIResponse;
}

export const receiveBackOrder = async (ordersStore: OrdersStore) => {
  const createOrderContext: CreateOrderContext = {};

  return new TaskExecutor([
    new CreateOrderTask(createOrderContext, ordersStore),
  ]).execute();
};

class CreateOrderTask extends Task {
  createOrderContext: CreateOrderContext;
  ordersStore: OrdersStore;
  ssoStore: SSOStore;

  constructor(
    createOrderContext: CreateOrderContext,
    ordersStore: OrdersStore,
    sso_store = ssoStore,
  ) {
    super();
    this.createOrderContext = createOrderContext;
    this.ordersStore = ordersStore;
    this.ssoStore = sso_store;
  }

  async run() {
    const orderDetails = this.mapProducts(this.ordersStore.getProducts);

    const repairFacilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;
    const param = {
      comments: '',
      customPoNumber: '',
      orderArea: '',
      orderDetails,
      orderGroup: '',
      orderId: 0,
      orderMethodTypeId: OrderMethodType.Manual,
      orderTotal: 0,
      orderTypeId: OrderType.Purchase,
      repairFacilityId,
      supplierId,
      taxStatus: '',
    };

    await receiveBackOrderAPI(param);
  }

  mapProducts(products: ProductModel[]): OrderDetailsProduct[] {
    return products.map(
      ({ inventoryAssignmentId, isTaxable, reservedCount, job, cost }) => {
        return {
          inventoryAssignmentId,
          orderQty: reservedCount,
          isTaxable: Number(!!isTaxable),
          jobId: job?.jobId ?? 0,
          price: cost,
        };
      },
    );
  }
}
