import { tryFetch } from '../helpers/tryFetch';
import { URLProvider } from '../helpers';
import { AuthStore } from '../../stores/AuthStore';

interface GetRoleManagerParams {
  token: string;
}

interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = (
  { token }: GetRoleManagerParams,
  authStore: AuthStore,
) => {
  const url = new URLProvider(authStore).getRoleModelUrl();

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
