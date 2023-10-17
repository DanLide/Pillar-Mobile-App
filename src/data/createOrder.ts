import { Task, TaskExecutor } from './helpers';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import { createOrderAPI, OrderDetailsProduct } from 'src/data/api/orders';
import { ProductModel } from 'src/stores/types';
import { OrderMethodType, OrderType } from 'src/constants/common.enum';
import { SSOStore } from 'src/stores/SSOStore';
import { ssoStore } from 'src/stores';
import { assoc, head } from 'ramda';
import { stocksStore, StockStore } from 'src/modules/stocksList/stores';

export const createOrder = async (ordersStore: OrdersStore) => {
  return new TaskExecutor([new CreateOrderTask(ordersStore)]).execute();
};

class CreateOrderTask extends Task {
  ordersStore: OrdersStore;
  ssoStore: SSOStore;
  stocksStore: StockStore;

  constructor(
    ordersStore: OrdersStore,
    sso_store = ssoStore,
    stocks_store = stocksStore,
  ) {
    super();
    this.ordersStore = ordersStore;
    this.ssoStore = sso_store;
    this.stocksStore = stocks_store;
  }

  async run() {
    const productList = this.ordersStore.getProducts;
    const orderDetails = this.mapProducts(productList);

    const repairFacilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;

    const order = head(
      (await createOrderAPI({
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
      })) ?? [],
    );

    const supplierName = supplierId
      ? this.stocksStore.getSupplierNameById(supplierId)
      : undefined;

    this.ordersStore.setCurrentOrder({
      // TODO: remove ts-ignore after backend fix
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      order: assoc('supplierName', supplierName, order),
      productList,
    });
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
