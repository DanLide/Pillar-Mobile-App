import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI } from './api';

import {
  StockModel,
  StockStore,
} from '../modules/stocksList/stores/StocksStore';

interface FetchStocksContext {
  stocks: StockModel[];
}

export const fetchStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
  };
  const result = await new TaskExecutor([
    new FetchStocksTask(stocksContext),
    new SaveStocksToStore(stocksContext, stocksStore),
  ]).execute();

  return result;
};

export class FetchStocksTask extends Task {
  fetchStocksContext: FetchStocksContext;

  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    const response = await getFetchStockAPI();
    this.fetchStocksContext.stocks = response;
  }
}

export class SaveStocksToStore extends Task {
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
