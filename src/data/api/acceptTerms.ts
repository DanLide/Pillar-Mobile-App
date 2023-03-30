import { URLProvider } from '../helpers';
import { tryFetch } from '../helpers';
import { PartySettingsType } from '../../constants';

export interface AcceptTermsAPIParams {
  partyRoleId: number;
  token: string;
}

export const acceptTermsAPI = ({
  partyRoleId,
  token,
}: AcceptTermsAPIParams) => {
  const url = new URLProvider().getAcceptTermsUrl(partyRoleId);

  const body = JSON.stringify([
    { id: PartySettingsType.IsTermsAccepted, value: true },
  ]);

  return tryFetch<Response>(url, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}` },
    body,
  });
};
