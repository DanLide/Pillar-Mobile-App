import { Task, TaskExecutor } from './helpers';

import {
  StockModel,
  StockStore,
} from '../modules/stocksList/stores/StocksStore';
import { MobileDevice, SSOStore } from '../stores/SSOStore';
import {
  SingleSSOAPIResponse,
  deviceByRepairFacilityIdAPI,
  getRNTokenAPI,
  shopSetupLoginAPI,
  singleSSOAPI,
} from './api/ssoAPI';
import { getFetchStockByPartyRoleIdAPI } from './api/stocksAPI';
import { mapSingle } from './helpers/utils';
import { setSSORNToken } from 'src/helpers/localStorage';
import { deviceInfoStore } from 'src/stores';

interface FetchStocksContext {
  shop: SingleSSOAPIResponse;
  stocks: StockModel[];
  ssoMobileDevices: MobileDevice[];
  rnToken?: string;
}

export const fetchStocksByShopSetupCodeTask = async (
  shopSetupCode: string,
  ssoStore: SSOStore,
  stocksStore: StockStore,
) => {
  const stocksContext: FetchStocksContext = {
    shop: <SingleSSOAPIResponse>{},
    stocks: [],
    ssoMobileDevices: [],
    rnToken: undefined,
  };

  return new TaskExecutor([
    new FetchShopByShopSetupCodeTask(stocksContext, shopSetupCode, ssoStore),
    new FetchStocksByShopTask(stocksContext),
    new FetchSSOMobileDevicesTask(stocksContext, ssoStore),
    // new FetchRNTokenTask(stocksContext),
    new SaveDataToStore(stocksContext, stocksStore, ssoStore),
  ]).execute();
};

export class FetchShopByShopSetupCodeTask extends Task {
  fetchStocksContext: FetchStocksContext;
  shopSetupCode: string;
  ssoStore: SSOStore;
  constructor(
    fetchStocksContext: FetchStocksContext,
    shopSetupCode: string,
    ssoStore: SSOStore,
  ) {
    super();
    this.fetchStocksContext = fetchStocksContext;
    this.shopSetupCode = shopSetupCode;
    this.ssoStore = ssoStore;
  }

  async run(): Promise<void> {
    const shop = await shopSetupLoginAPI(this.shopSetupCode);

    const response = await singleSSOAPI(shop.repairFacilityId);
    if (response) {
      this.fetchStocksContext.shop = response;
      const mappedResponse = mapSingle(response);
      mappedResponse && this.ssoStore.setCurrentSSO(mappedResponse);
    }
  }
}

export class FetchStocksByShopTask extends Task {
  fetchStocksContext: FetchStocksContext;
  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    const response = await getFetchStockByPartyRoleIdAPI();
    if (response) {
      this.fetchStocksContext.stocks = response;
    }
  }
}

export class FetchSSOMobileDevicesTask extends Task {
  fetchStocksContext: FetchStocksContext;
  ssoStore: SSOStore;

  constructor(fetchStocksContext: FetchStocksContext, ssoStore: SSOStore) {
    super();
    this.fetchStocksContext = fetchStocksContext;
    this.ssoStore = ssoStore;
  }

  async run(): Promise<void> {
    const response = await deviceByRepairFacilityIdAPI();
    if (!response) throw Error('Request failed!');

    if (
      response.find(
        device => device.leanTecSerialNo === deviceInfoStore.getDeviceName,
      )
    ) {
      this.fetchStocksContext.ssoMobileDevices = response;
    } else {
      throw Error('Device not assign to Repair facility!');
    }
  }
}

class FetchRNTokenTask extends Task {
  fetchStocksContext: FetchStocksContext;
  constructor(fetchStocksContext: FetchStocksContext) {
    super();
    this.fetchStocksContext = fetchStocksContext;
  }

  async run(): Promise<void> {
    const response = await getRNTokenAPI();
    if (response) {
      this.fetchStocksContext.rnToken = response;
    }
  }
}

export class SaveDataToStore extends Task {
  fetchStocksContext: FetchStocksContext;
  stocksStore: StockStore;
  ssoStore: SSOStore;

  constructor(
    fetchStocksContext: FetchStocksContext,
    stocksStore: StockStore,
    ssoStore: SSOStore,
  ) {
    super();
    this.stocksStore = stocksStore;
    this.fetchStocksContext = fetchStocksContext;
    this.ssoStore = ssoStore;
  }

  async run() {
    this.stocksStore.setStocks(this.fetchStocksContext.stocks);
    this.ssoStore.setSSOMobileDevices(this.fetchStocksContext.ssoMobileDevices);
    this.ssoStore.setDeviceConfiguration(true);
    if (this.ssoStore.getCurrentSSO) {
      setSSORNToken('RNToken', this.ssoStore.getCurrentSSO);
    }
  }
}
