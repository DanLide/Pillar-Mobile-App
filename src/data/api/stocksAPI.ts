import { URLProvider, tryAuthFetch } from '../helpers';
import {
  StockModel,
  StockModelWithMLAccess,
} from 'src/modules/stocksList/stores/StocksStore';

interface ResetMasterlockRequest {
  storage: Array<{ deviceIdentifier: string; id: number }>;
  device: Array<{ id: number }>;
  repairFacilityId: string;
}

export const getFetchStockAPI = () => {
  const url = new URLProvider().getFetchStocksWithCabinetsData();
  return tryAuthFetch<StockModelWithMLAccess[]>({
    url,
    request: { method: 'GET' },
  });
};

export const getFetchStockByPartyRoleIdAPI = () => {
  const url = new URLProvider().getFetchStockByPartyRoleIdUrl();

  return tryAuthFetch<StockModel[]>({ url, request: { method: 'GET' } });
};

export const resetMasterlockAPI = (body: ResetMasterlockRequest) => {
  const url = new URLProvider().resetMasterlock();

  return tryAuthFetch<undefined>({
    url,
    request: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};
