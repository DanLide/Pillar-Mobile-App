import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI, getFetchStockByDeviceNameAPI } from './api';

import {
  CategoryModel,
  FacilityProductModel,
  StockModelWithMLAccess,
  StockStore,
  SupplierModel,
} from '../modules/stocksList/stores/StocksStore';
import {
  getCategoriesByFacilityIdAPI,
  getFacilityProducts,
  getSupplierListByFacilityIdAPI,
} from './api/productsAPI';
import { any, isEmpty } from 'ramda';

interface FetchStocksContext {
  stocks: StockModelWithMLAccess[];
  categories: CategoryModel[];
  suppliers: SupplierModel[];
  facilityProducts: FacilityProductModel[];
}

export const fetchManageProductsStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
    categories: [],
    suppliers: [],
    facilityProducts: [],
  };
  if (
    any(isEmpty, [
      stocksStore.stocks,
      stocksStore.categories,
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
    let stocks: StockModelWithMLAccess[] | undefined = [];
    try {
      stocks = await getFetchStockByDeviceNameAPI();
    } catch (error) {
      stocks = await getFetchStockAPI();
    }
    const [categories, suppliers, facilityProducts] = await Promise.all([
      getCategoriesByFacilityIdAPI(),
      getSupplierListByFacilityIdAPI(),
      getFacilityProducts(),
    ]);

    this.fetchStocksContext.stocks = stocks ?? [];
    this.fetchStocksContext.categories = categories ?? [];
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
    const { stocks, facilityProducts, categories, suppliers } =
      this.fetchStocksContext;

    this.stocksStore.setStocks(stocks);
    this.stocksStore.setFacilityProducts(facilityProducts);
    this.stocksStore.setCategories(categories);
    this.stocksStore.setSuppliers(suppliers);
  }
}
