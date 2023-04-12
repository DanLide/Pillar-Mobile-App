import { tryFetch, TryFetchParams } from './tryFetch';
import { GetAuthToken, getAuthToken } from './getAuthToken';
import { assocPath } from 'ramda';

interface TryAuthFetchParams extends TryFetchParams {
  authToken?: GetAuthToken;
}

export const tryAuthFetch = async <ResponseType>({
  url,
  request,
  logoutListener,
  authToken = getAuthToken(),
}: TryAuthFetchParams) => {
  const token = authToken?.getToken;

  return tryFetch<ResponseType>({
    url,
    logoutListener,
    request: token
      ? assocPath(['headers', 'authorization'], `Bearer ${token}`, request)
      : request,
  });
};
