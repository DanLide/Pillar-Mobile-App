import { tryFetch } from '../helpers/tryFetch';
import { URLProvider } from '../helpers';

interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  partyRoleId: string;
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = (token: string) => {
  const url = new URLProvider().getRoleModelUrl();

  return tryFetch<GetRoleManagerAPIResponse>(url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
