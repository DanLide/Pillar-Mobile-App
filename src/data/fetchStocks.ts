import { Task, TaskExecutor } from './helpers';
import { getStocksAPI } from './api';

import { Stock, StockStore } from '../modules/stocksList/stores/StocksStore';

interface FetchStocksContext {
  stocks: Stock[];
}

export const fetchStocks = async (
  stocksStore: StockStore,
) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
  };

  const result = await new TaskExecutor([
    new FetchStocksTask(stocksContext),
    new SaveStocksToStore(stocksContext, stocksStore),
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
    this.fetchStocksContext.stocks = response;
  }
}

class SaveStocksToStore extends Task {
  fetchStocksContext: FetchStocksContext;
  stocksStore: StockStore;

  constructor(fetchStocksContext: FetchStocksContext, stocksStore: StockStore) {
    super();
    this.stocksStore = stocksStore;
    this.fetchStocksContext = fetchStocksContext;
  }

  async run() {
    this.stocksStore.setStocks(this.fetchStocksContext.stocks);
  }
}
