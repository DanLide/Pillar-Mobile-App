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

export const setPinAPI = (rnToken: string, b2cUserId: string, pin: string) => {
  const url = new URLProvider().setPin(b2cUserId);

  const body = JSON.stringify({ pin });

  return tryFetch<string>({
    url,
    request: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        rn_token: rnToken,
      },
    },
  });
};

export const getLoginLinkAPI = (
  rnToken: string,
  b2cUserId: string,
  pin: string,
) => {
  const url = new URLProvider().getLoginLink(b2cUserId, pin);

  return tryFetch<string>({
    url,
    request: {
      method: 'GET',
      headers: { rn_token: rnToken },
    },
  });
};
