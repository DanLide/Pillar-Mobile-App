import { Task, TaskExecutor } from './helpers';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import { createOrderAPI, CreateOrderRequestProduct } from 'src/data/api/orders';
import { ProductModel } from 'src/stores/types';
import { OrderMethodType, OrderType } from 'src/constants/common.enum';
import { SSOStore } from 'src/stores/SSOStore';
import { ssoStore } from 'src/stores';

export const createOrder = async (ordersStore: OrdersStore) => {
  return new TaskExecutor([new CreateOrderTask(ordersStore)]).execute();
};

class CreateOrderTask extends Task {
  ordersStore: OrdersStore;
  ssoStore: SSOStore;

  constructor(ordersStore: OrdersStore, sso_store = ssoStore) {
    super();
    this.ordersStore = ordersStore;
    this.ssoStore = sso_store;
  }

  async run() {
    const orderDetails = this.mapProducts(this.ordersStore.getProducts);
    const repairFacilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;

    await createOrderAPI({
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
    });
  }

  mapProducts(products: ProductModel[]): CreateOrderRequestProduct[] {
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
