import { Task, TaskExecutor } from './helpers';
import { getStoresAPI } from './api';

import { Stock, StockStore } from '../modules/stocksList/stores/StocksStore';
import { AuthStore } from '../stores/AuthStore';

interface GetStoresContext {
  stores: Stock[];
  facilityPisaID?: number;
  partyRoleId?: number;
}

export const getStores = async (
  authStore: AuthStore,
  stocksStore: StockStore,
) => {
  const storesContext: GetStoresContext = {
    stores: [],
    facilityPisaID: authStore.getFacilityPisaID,
    partyRoleId: authStore.getPartyRoleId,
  };

  const result = await new TaskExecutor([
    new GetStoresTask(storesContext),
    new SaveStoresToStore(storesContext, stocksStore),
  ]).execute();

  return result;
};

class GetStoresTask extends Task {
  getStoresContext: GetStoresContext;

  constructor(getStoresContext: GetStoresContext) {
    super();
    this.getStoresContext = getStoresContext;
  }

  async run(): Promise<void> {
    if (
      this.getStoresContext.facilityPisaID &&
      this.getStoresContext.partyRoleId
    ) {
      const response = await getStoresAPI(
        this.getStoresContext.facilityPisaID,
        this.getStoresContext.partyRoleId,
      );

      this.getStoresContext.stores = response;
    } else {
      throw Error('Auth error!');
    }
  }
}

class SaveStoresToStore extends Task {
  getStoresContext: GetStoresContext;
  stocksStore: StockStore;

  constructor(getStoresContext: GetStoresContext, stocksStore: StockStore) {
    super();
    this.stocksStore = stocksStore;
    this.getStoresContext = getStoresContext;
  }

  async run() {
    this.stocksStore.setStocks(this.getStoresContext.stores);
  }
}
