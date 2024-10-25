import { isEmpty } from 'ramda';

import { Task, TaskExecutor } from './helpers';
import { getFetchStockByDeviceNameAPI, getFetchStockAPI } from './api';

import {
  StockModelWithMLAccess,
  StockStore,
} from '../modules/stocksList/stores/StocksStore';

interface FetchStocksContext {
  stocks: StockModelWithMLAccess[];
}

export const fetchStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
  };
  if (isEmpty(stocksStore.stocks)) {
    return new TaskExecutor([
      new FetchStocksTask(stocksContext),
      new SaveStocksToStore(stocksContext, stocksStore),
    ]).execute();
  }
};

export class FetchStocksTask extends Task {
  fetchStocksContext: FetchStocksContext;

  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    let response: StockModelWithMLAccess[] | undefined = [];
    try {
      response = await getFetchStockByDeviceNameAPI();
    } catch (error) {
      response = await getFetchStockAPI();
    }
    this.fetchStocksContext.stocks = response || [];
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
