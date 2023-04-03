import { URLProvider, tryAuthFetch } from '../helpers';

interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  partyRoleId: number;
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = () => {
  const url = new URLProvider().getRoleModelUrl();

  return tryAuthFetch<GetRoleManagerAPIResponse>({
    url,
    request: { method: 'GET' },
  });
};
