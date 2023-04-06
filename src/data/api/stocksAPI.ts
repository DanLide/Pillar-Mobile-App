import { URLProvider, tryAuthFetch } from '../helpers';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';

export const getFetchStockAPI = () => {
  const url = new URLProvider().getFetchStockUrl();

  return tryAuthFetch<StockModel[]>({ url, request: { method: 'GET' } });
};
