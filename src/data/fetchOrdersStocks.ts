import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI } from './api';

import {
  FacilityProductModel,
  StockModelWithMLAccess,
  StockStore,
  SupplierModel,
} from '../modules/stocksList/stores/StocksStore';
import {
  getFacilityProducts,
  getSupplierListByFacilityIdAPI,
} from './api/productsAPI';
import { any, isEmpty } from 'ramda';

interface FetchStocksContext {
  stocks: StockModelWithMLAccess[];
  suppliers: SupplierModel[];
  facilityProducts: FacilityProductModel[];
}

export const fetchOrdersStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
    suppliers: [],
    facilityProducts: [],
  };
  if (
    any(isEmpty, [
      stocksStore.stocks,
      stocksStore.suppliers,
      stocksStore.facilityProducts,
    ])
  ) {
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
    const [stocks, suppliers, facilityProducts] = await Promise.all([
      getFetchStockAPI(),
      getSupplierListByFacilityIdAPI(),
      getFacilityProducts(),
    ]);

    this.fetchStocksContext.stocks = stocks ?? [];
    this.fetchStocksContext.suppliers = suppliers ?? [];
    this.fetchStocksContext.facilityProducts = facilityProducts ?? [];
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
    const { stocks, suppliers, facilityProducts } = this.fetchStocksContext;

    this.stocksStore.setStocks(stocks);
    this.stocksStore.setSuppliers(suppliers);
    this.stocksStore.setFacilityProducts(facilityProducts);
  }
}
