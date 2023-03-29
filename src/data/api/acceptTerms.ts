import { URLProvider } from '../helpers';
import { tryFetch } from '../helpers';
import { SettingTypeID } from '../../constants/settings';

export interface AcceptTermsAPIParams {
  partyRoleId: number;
}

export const acceptTermsAPI = ({ partyRoleId }: AcceptTermsAPIParams) => {
  const url = new URLProvider().getAcceptTermsUrl(partyRoleId);

  const body = JSON.stringify([
    { id: SettingTypeID.IsTermsAccepted, value: true },
  ]);

  return tryFetch<Response>(url, { method: 'PUT', body });
};
