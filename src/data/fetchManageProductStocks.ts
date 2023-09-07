import { Task, TaskExecutor } from './helpers';
import { getFetchStockAPI } from './api';

import {
  CategoryModel,
  FacilityProductModel,
  StockModel,
  StockStore, SupplierModel
} from "../modules/stocksList/stores/StocksStore";
import {
  getCategoriesByFacilityIdAPI,
  getFacilityProducts,
  getSupplierListByFacilityIdAPI,
} from './api/productsAPI';

interface FetchStocksContext {
  stocks: StockModel[];
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
    const [stocks, categories, suppliers, facilityProducts] = await Promise.all(
      [
        getFetchStockAPI(),
        getCategoriesByFacilityIdAPI(),
        getSupplierListByFacilityIdAPI(),
        getFacilityProducts(),
      ],
    );

    this.fetchStocksContext.stocks = stocks;
    this.fetchStocksContext.categories = categories;
    this.fetchStocksContext.suppliers = suppliers;
    this.fetchStocksContext.facilityProducts = facilityProducts;
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
