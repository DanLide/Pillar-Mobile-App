import { Task, TaskExecutor } from './helpers';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  createOrderAPI,
  GetOrdersAPIResponse,
  OrderDetailsProduct,
} from 'src/data/api/orders';
import { ProductModel } from 'src/stores/types';
import {
  OrderMethodType,
  OrderStatusType,
  OrderType,
} from 'src/constants/common.enum';
import { SSOStore } from 'src/stores/SSOStore';
import { ssoStore } from 'src/stores';
import { assoc, head } from 'ramda';
import { stocksStore, StockStore } from 'src/modules/stocksList/stores';

interface CreateOrderContext {
  orderResponse?: GetOrdersAPIResponse;
}

export const createOrder = async (
  ordersStore: OrdersStore,
  orderType = OrderType.Purchase,
) => {
  const createOrderContext: CreateOrderContext = {};

  return new TaskExecutor([
    new CreateOrderTask(createOrderContext, orderType, ordersStore),
    new SaveOrderDataTask(createOrderContext, orderType, ordersStore),
  ]).execute();
};

class CreateOrderTask extends Task {
  createOrderContext: CreateOrderContext;
  orderType: OrderType;
  ordersStore: OrdersStore;
  ssoStore: SSOStore;

  constructor(
    createOrderContext: CreateOrderContext,
    orderType: OrderType,
    ordersStore: OrdersStore,
    sso_store = ssoStore,
  ) {
    super();
    this.createOrderContext = createOrderContext;
    this.orderType = orderType;
    this.ordersStore = ordersStore;
    this.ssoStore = sso_store;
  }

  async run() {
    const orderDetails = this.mapProducts(this.ordersStore.getProducts);

    const repairFacilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;

    const orderMethodTypeId =
      this.orderType === OrderType.Purchase
        ? OrderMethodType.Manual
        : OrderMethodType.Return;

    this.createOrderContext.orderResponse = head(
      (await createOrderAPI({
        comments: '',
        customPoNumber: '',
        orderArea: '',
        orderDetails,
        orderGroup: '',
        orderId: 0,
        orderMethodTypeId,
        orderTotal: 0,
        orderTypeId: this.orderType,
        repairFacilityId,
        supplierId,
        taxStatus: '',
      })) ?? [],
    );
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

class SaveOrderDataTask extends Task {
  createOrderContext: CreateOrderContext;
  orderType: OrderType;
  ordersStore: OrdersStore;
  stocksStore: StockStore;

  constructor(
    createOrderContext: CreateOrderContext,
    orderType: OrderType,
    ordersStore: OrdersStore,
    stocks_store = stocksStore,
  ) {
    super();
    this.createOrderContext = createOrderContext;
    this.orderType = orderType;
    this.ordersStore = ordersStore;
    this.stocksStore = stocks_store;
  }

  async run() {
    const { orderResponse } = this.createOrderContext;

    if (!orderResponse) throw new Error();

    const productList = this.ordersStore.getProducts;
    const supplierId = this.ordersStore.supplierId;

    const supplierName = supplierId
      ? this.stocksStore.getSupplierNameById(supplierId)
      : undefined;

    this.ordersStore.setCurrentOrder({
      order: assoc('supplierName', supplierName, orderResponse),
      productList,
    });
  }
}
