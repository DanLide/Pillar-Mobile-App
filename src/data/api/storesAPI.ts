import { URLProvider, tryAuthFetch } from '../helpers';
import { PartySettingsType } from '../../constants';
import { Stock } from '../../modules/stocksList/stores/StocksStore';

export const getStocksAPI = () => {
  const url = new URLProvider().getStocksUrl();

  return tryAuthFetch<Stock[]>({ url, request: { method: 'GET' } });
};
