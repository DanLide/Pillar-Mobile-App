import { URLProvider, tryFetch } from '../helpers';
import { LoginAPIResponse } from './login';

export const refreshTokenAPI = () => {
  const url = new URLProvider().refreshToken();
  return tryFetch<LoginAPIResponse>({ url, request: { method: 'POST' } });
};
