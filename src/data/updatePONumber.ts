import { Task, TaskExecutor } from './helpers';
import { OrdersStore } from 'src/modules/orders/stores/OrdersStore';
import { updatePONumberAPI } from 'src/data/api/orders';

interface UpdatePONumberContext {
  poNumber: string;
}

export const updatePONumber = async (
  poNumber: string,
  ordersStore: OrdersStore,
) => {
  const updatePONumberContext: UpdatePONumberContext = { poNumber };

  return new TaskExecutor([
    new UpdatePONumberTask(updatePONumberContext, ordersStore),
    new SavePONumberTask(updatePONumberContext, ordersStore),
  ]).execute();
};

class UpdatePONumberTask extends Task {
  updatePONumberContext: UpdatePONumberContext;
  ordersStore: OrdersStore;

  constructor(
    updatePONumberContext: UpdatePONumberContext,
    ordersStore: OrdersStore,
  ) {
    super();
    this.updatePONumberContext = updatePONumberContext;
    this.ordersStore = ordersStore;
  }

  async run(): Promise<void> {
    const orderId = this.ordersStore.currentOrder?.order.orderId;

    if (!orderId) throw new Error();

    await updatePONumberAPI(orderId, this.updatePONumberContext.poNumber);
  }
}

class SavePONumberTask extends Task {
  updatePONumberContext: UpdatePONumberContext;
  ordersStore: OrdersStore;

  constructor(
    updatePONumberContext: UpdatePONumberContext,
    ordersStore: OrdersStore,
  ) {
    super();
    this.updatePONumberContext = updatePONumberContext;
    this.ordersStore = ordersStore;
  }

  async run() {
    this.ordersStore.setPONumber(this.updatePONumberContext.poNumber);
  }
}
