import { URLProvider, tryAuthFetch } from '../helpers';
import { PartySettingsType } from '../../constants';
import { Stock } from '../../modules/stocksList/stores/StocksStore';

export const getStoresAPI = (facilityId: number, partyRoleID: number) => {
  const url = new URLProvider().getStocksUrl(facilityId, partyRoleID);

  const body = JSON.stringify([
    { id: PartySettingsType.IsTermsAccepted, value: true },
  ]);

  return tryAuthFetch<Stock[]>({ url, request: { method: 'GET' } });
};
