import { URLProvider, tryFetch } from '../helpers';

export interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  orgPartyRoleID: number;
  partyRoleId: number;
  languageTypeId: number;
  roleTypeDescription?: string;
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = (token: string) => {
  const url = new URLProvider().getRoleModelUrl();

  return tryFetch<GetRoleManagerAPIResponse>({
    url,
    request: {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};
