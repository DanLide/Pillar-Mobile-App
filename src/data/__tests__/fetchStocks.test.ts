import { StockModelWithMLAccess } from './../../modules/stocksList/stores/StocksStore';
import {
  fetchStocks,
  FetchStocksTask,
  SaveStocksToStore,
} from '../fetchStocks';

import { getFetchStockAPI } from '../api/stocksAPI';

import {
  StockStore,
} from '../../modules/stocksList/stores/StocksStore';

jest.mock('../api/stocksAPI');

const mockStockResponse: StockModelWithMLAccess[] = [{
  equipment:{
    organizationName: 'organizationName',
    partyRoleId: 1,
    roleTypeId: 1,
    leanTecSerialNo: 'leanTecSerialNo',
  },
  mlAccessData: null,
}];

const mockExpected = mockStockResponse

const mockSetStock = jest.fn();

const mockStockStore: StockStore = {
  stocks: [],
  setStocks: mockSetStock,
  clear: jest.fn(),
};

describe('fetchStocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute FetchStocksTask task', async () => {
    (getFetchStockAPI as jest.Mock).mockReturnValue(mockStockResponse);
    const fetchStocksTask = new FetchStocksTask({ stocks: [] });
    await expect(fetchStocksTask.run()).resolves.not.toThrow();
    expect(fetchStocksTask.fetchStocksContext.stocks).toStrictEqual(mockExpected);
    expect(getFetchStockAPI).toHaveBeenCalled();
  });

  it('should throw Error FetchStocksTask task', async () => {
    (getFetchStockAPI as jest.Mock).mockImplementation(() => {
      throw Error();
    });
    const fetchStocksTask = new FetchStocksTask({ stocks: [] });
    await expect(fetchStocksTask.run()).rejects.toThrow();
    expect(getFetchStockAPI).toHaveBeenCalled();
  });

  it('should execute SaveStocksToStore task', () => {
    const saveStocksToStore = new SaveStocksToStore(
      { stocks: mockStockResponse },
      mockStockStore,
    );
    expect(saveStocksToStore.run()).resolves.not.toThrow();
    expect(mockSetStock).toHaveBeenCalledWith(
      mockStockResponse,
    );
  });

  it('should call fetchStocks with empty stocks in stocksStore', async () => {
    await fetchStocks(mockStockStore);
    expect(getFetchStockAPI).toHaveBeenCalled();
  });
});
