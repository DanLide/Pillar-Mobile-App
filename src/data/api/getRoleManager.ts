import { URLProvider, tryFetch } from '../helpers';

export interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  partyRoleId: number;
  orgPartyRoleID: number;
  languageTypeId: number;
  roleTypeDescription?: string;
  isTermsAccepted?: boolean;
  orgRoleTypeID?: number;
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
