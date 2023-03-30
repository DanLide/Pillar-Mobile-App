import { AuthStore } from '../../stores/AuthStore';
import { URLProvider, tryFetch } from '../helpers';

export interface LoginAPIParams {
  username: string;
  password: string;
}

interface LoginAPIResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const loginAPI = (
  { password, username }: LoginAPIParams,
  authStore: AuthStore,
) => {
  const url = new URLProvider(authStore).getLoginUrl();

  url.searchParams.set('password', password);
  url.searchParams.set('username', username);
  url.search = decodeURIComponent(url.search);

  return tryFetch<LoginAPIResponse>({ url, request: { method: 'POST' } });
};
