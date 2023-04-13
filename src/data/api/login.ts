import { URLProvider, tryFetch } from '../helpers';

export interface LoginAPIParams {
  username: string;
  password: string;
}

export interface LoginAPIResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const loginAPI = (params: LoginAPIParams) => {
  const url = new URLProvider().getLoginUrl();

  url.searchParams.set('password', params.password);
  url.searchParams.set('username', params.username);
  url.search = decodeURIComponent(url.search);

  return tryFetch<LoginAPIResponse>({ url, request: { method: 'POST' } });
};
