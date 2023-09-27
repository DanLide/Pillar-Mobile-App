import { isEmpty } from 'ramda';

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
    const response = await getFetchStockAPI();
     
    // TODO remove this line to remove mocks
    this.fetchStocksContext.stocks = mock2Locks(response);
    // TODO uncomment
    //this.fetchStocksContext.stocks = response;
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

// TODO remove mocking
const mock2Locks = (original: StockModel[] | undefined) => {
  const dmytrosStock: StockModel = {
    organizationName: "Dmytro's lock",
    partyRoleId: 123,
    roleTypeId: 5,
    deviceId: 'A323SH',
    leanTecSerialNo: 'A323SH',
    accessProfile: 'Lpg6YPm4GE1gQ3jQr+hs6TZl0LjHehnTjhkq28HTVbU=|gK0ibWbtADZ9TbF3E6WTzhMQLfCzfjcpxCQLuK82MbiBb1RdFFcSSX42c/vJSSCyIngxjmt2cYvH11jFpidhI4M1imDXhA==',
    firmwareVersion: 1593712124
  }

  const andriisStock: StockModel = {
    organizationName: "Andrii's lock",
    partyRoleId: 234,
    roleTypeId: 5,
    deviceId: 'A3037J',
    leanTecSerialNo: 'A3037J',
    accessProfile: '3hwkTRbLosp2lyRGc9pLEZ3PSUuWX2oc1zHvQ4zNnpU=|gK5mLmChADYSvJdDUSN+qPEEvl4MKlkn+RXadGZRUzQ6fMFxVGxMjXutcqimBk9u0PxbPsYDCU3YBw9eAuPKlfemQTRGGQ==',
    firmwareVersion: 1593712124
  }
  if (original) {
    return [dmytrosStock, andriisStock].concat(original);
  }
  return [dmytrosStock, andriisStock];
};
