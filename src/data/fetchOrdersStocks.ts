import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI } from './api';

import {
  StockModel,
  StockStore,
  SupplierModel,
} from '../modules/stocksList/stores/StocksStore';
import { getSupplierListByFacilityIdAPI } from './api/productsAPI';
import { any, isEmpty } from 'ramda';

interface FetchStocksContext {
  stocks: StockModel[];
  suppliers: SupplierModel[];
}

export const fetchOrdersStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
    suppliers: [],
  };
  if (any(isEmpty, [stocksStore.stocks, stocksStore.suppliers])) {
    return new TaskExecutor([
      new FetchManageProductStocksTask(stocksContext),
      new SaveStocksToStore(stocksContext, stocksStore),
    ]).execute();
  }
};

export class FetchManageProductStocksTask extends Task {
  fetchStocksContext: FetchStocksContext;

  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    const [stocks, suppliers] = await Promise.all([
      getFetchStockAPI(),
      getSupplierListByFacilityIdAPI(),
    ]);

    this.fetchStocksContext.stocks = stocks ?? [];
    this.fetchStocksContext.suppliers = suppliers ?? [];
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
    const { stocks, suppliers } = this.fetchStocksContext;

    this.stocksStore.setStocks(stocks);
    this.stocksStore.setSuppliers(suppliers);
  }
}
