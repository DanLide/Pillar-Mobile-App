import { tryFetch, TryFetchParams } from './tryFetch';
import { GetAuthToken, getAuthToken } from './getAuthToken';
import { assocPath } from 'ramda';
import { refreshToken } from '../refreshToken';
import { getLogoutListener } from './getLogoutListener';

interface TryAuthFetchParams extends TryFetchParams {
  authToken?: GetAuthToken;
}

export const tryAuthFetch = async <ResponseType>({
  url,
  request,
  authToken = getAuthToken(),
  logoutListener = getLogoutListener(),
}: TryAuthFetchParams) => {
  if (authToken.isTokenExpired) {
    const error = await refreshToken();
    if (error) {
      logoutListener.onServerLogout();
      return;
    }
  }
  return tryFetch<ResponseType>({
    url,
    request: assocPath(
      ['headers', 'authorization'],
      `Bearer ${authToken?.getToken ?? ''}`,
      request,
    ),
  });
};
