import { URLProvider } from '../helpers';
import { PartySettingsType } from '../../constants';
import { tryAuthFetch } from '../helpers/tryAuthFetch';

export interface AcceptTermsAPIParams {
  partyRoleId: number;
}

export const acceptTermsAPI = ({ partyRoleId }: AcceptTermsAPIParams) => {
  const url = new URLProvider().getAcceptTermsUrl(partyRoleId);

  const body = JSON.stringify([
    { id: PartySettingsType.IsTermsAccepted, value: true },
  ]);

  return tryAuthFetch<Response>({ url, request: { method: 'PUT', body } });
};
