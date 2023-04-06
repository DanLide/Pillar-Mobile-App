import { URLProvider, tryAuthFetch } from '../helpers';
import { PartySettingsType } from '../../constants';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';

export const getStocksAPI = () => {
  const url = new URLProvider().getStocksUrl();

  return tryAuthFetch<StockModel[]>({ url, request: { method: 'GET' } });
};
