import { URLProvider, tryFetch } from '../helpers';

interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
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
