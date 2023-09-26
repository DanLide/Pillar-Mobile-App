import { URLProvider } from './urlProvider';
import { tryFetch } from './tryFetch';
import { LoginAPIResponse } from '../api/login';

export const refreshTokenAPI = () => {
  const url = new URLProvider().refreshToken();
  return tryFetch<LoginAPIResponse>({ url, request: { method: 'POST' } });
};
