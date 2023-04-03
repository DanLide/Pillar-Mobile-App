import { URLProvider, tryAuthFetch } from '../helpers';
import { PartySettingsType } from '../../constants';

export const acceptTermsAPI = () => {
  const url = new URLProvider().getAcceptTermsUrl();

  const body = JSON.stringify([
    { id: PartySettingsType.IsTermsAccepted, value: true },
  ]);

  return tryAuthFetch<Response>({ url, request: { method: 'PUT', body } });
};
