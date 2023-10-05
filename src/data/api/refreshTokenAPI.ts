import { URLProvider } from '../helpers/urlProvider';
import { tryFetch } from '../helpers/tryFetch';
import { LoginAPIResponse } from './login';

export const refreshTokenAPI = () => {
  const url = new URLProvider().refreshToken();
  return tryFetch<LoginAPIResponse>({ url, request: { method: 'POST' } });
};
