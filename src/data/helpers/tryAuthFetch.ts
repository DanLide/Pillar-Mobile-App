import { tryFetch, TryFetchParams } from './tryFetch';
import { GetAuthToken, getAuthToken } from './getAuthToken';
import { assocPath } from 'ramda';

interface TryAuthFetchParams extends TryFetchParams {
  authToken?: GetAuthToken;
}

export const tryAuthFetch = async <ResponseType>({
  url,
  request,
  authToken = getAuthToken(),
}: TryAuthFetchParams) =>
  tryFetch<ResponseType>({
    url,
    request: assocPath(
      ['headers', 'authorization'],
      `Bearer ${authToken?.getToken}`,
      request,
    ),
  });
