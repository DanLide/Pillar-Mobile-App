import { tryFetch, TryFetchParams } from './tryFetch';
import { GetAuthToken, getAuthToken } from './getAuthToken';
import { assocPath } from 'ramda';
import { getLogoutListener } from './getLogoutListener';
import { refreshToken } from '../refreshToken';
import { Utils } from './utils';

interface TryAuthFetchParams extends TryFetchParams {
  authToken?: GetAuthToken;
}

export const tryAuthFetch = async <ResponseType>({
  url,
  request,
  disableLogoutOnUnauthorized,
  authToken = getAuthToken(),
  logoutListener = getLogoutListener(),
}: TryAuthFetchParams) => {
  const error = await refreshToken();
  if (error && !Utils.isNetworkError(error)) {
    logoutListener.onServerLogout();
    return;
  }
  return tryFetch<ResponseType>({
    url,
    request: assocPath(
      ['headers', 'authorization'],
      `Bearer ${authToken?.getToken ?? ''}`,
      request,
    ),
    disableLogoutOnUnauthorized,
  });
};
