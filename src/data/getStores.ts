import { Task, TaskExecutor } from './helpers';
import { getStocksAPI } from './api';

import { Stock, StockStore } from '../modules/stocksList/stores/StocksStore';
import { AuthStore } from '../stores/AuthStore';

interface GetStocksContext {
  stores: Stock[];
}

export const getStores = async (
  authStore: AuthStore,
  stocksStore: StockStore,
) => {
  const storesContext: GetStocksContext = {
    stores: [],
  };

  const result = await new TaskExecutor([
    new GetStoresTask(storesContext),
    new SaveStoresToStore(storesContext, stocksStore),
  ]).execute();

  return result;
};

class GetStoresTask extends Task {
  getStocksContext: GetStocksContext;

  constructor(getStocksContext: GetStocksContext) {
    super();
    this.getStocksContext = getStocksContext;
  }

  async run(): Promise<void> {
    const response = await getStocksAPI();
    this.getStocksContext.stores = response;
  }
}

class SaveStoresToStore extends Task {
  getStocksContext: GetStocksContext;
  stocksStore: StockStore;

  constructor(getStocksContext: GetStocksContext, stocksStore: StockStore) {
    super();
    this.stocksStore = stocksStore;
    this.getStocksContext = getStocksContext;
  }

  async run() {
    this.stocksStore.setStocks(this.getStocksContext.stores);
  }
}
