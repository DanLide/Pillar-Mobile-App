import { URLProvider } from '../helpers';
import { tryFetch } from '../helpers';
import { SettingTypeID } from '../../constants/settings';

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
    { id: SettingTypeID.IsTermsAccepted, value: true },
  ]);

  return tryFetch<Response>(url, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}` },
    body,
  });
};
