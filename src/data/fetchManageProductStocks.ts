import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI } from './api';

import {
  StockModel,
  StockStore,
} from '../modules/stocksList/stores/StocksStore';
import { CategoryModel } from '../stores/CategoriesStore';
import { SupplierModel } from '../stores/SuppliersStore';
import {
  getCategoriesByFacilityIdAPI,
  getSupplierListByFacilityIdAPI,
} from './api/productsAPI';
import { categoriesStore, suppliersStore } from '../stores';

interface FetchStocksContext {
  stocks: StockModel[];
  categories: CategoryModel[];
  suppliers: SupplierModel[];
}

export const fetchManageProductsStocks = async (stocksStore: StockStore) => {
  const stocksContext: FetchStocksContext = {
    stocks: [],
    categories: [],
    suppliers: [],
  };
  if (!stocksStore.stocks.length) {
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
    const [stocks, categories, suppliers] = await Promise.all([
      getFetchStockAPI(),
      getCategoriesByFacilityIdAPI(),
      getSupplierListByFacilityIdAPI(),
    ]);

    this.fetchStocksContext.stocks = stocks;
    this.fetchStocksContext.categories = categories;
    this.fetchStocksContext.suppliers = suppliers;
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
    categoriesStore.setCategories(this.fetchStocksContext.categories);
    suppliersStore.setSuppliers(this.fetchStocksContext.suppliers);
  }
}
