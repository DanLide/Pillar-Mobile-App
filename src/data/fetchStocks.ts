import { Task, TaskExecutor } from './helpers';
import { getStocksAPI } from './api';

import { Stock, StockStore } from '../modules/stocksList/stores/StocksStore';

interface FetchStocksContext {
  stores: Stock[];
}

export const fetchStocks = async (
  stocksStore: StockStore,
) => {
  const storesContext: FetchStocksContext = {
    stores: [],
  };

  const result = await new TaskExecutor([
    new FetchStocksTask(storesContext),
    new SaveStoresToStore(storesContext, stocksStore),
  ]).execute();

  return result;
};

class FetchStocksTask extends Task {
  fetchStocksContext: FetchStocksContext;

  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    const response = await getStocksAPI();
    this.fetchStocksContext.stores = response;
  }
}

class SaveStoresToStore extends Task {
  fetchStocksContext: FetchStocksContext;
  stocksStore: StockStore;

  constructor(fetchStocksContext: FetchStocksContext, stocksStore: StockStore) {
    super();
    this.stocksStore = stocksStore;
    this.fetchStocksContext = fetchStocksContext;
  }

  async run() {
    this.stocksStore.setStocks(this.fetchStocksContext.stores);
  }
}
