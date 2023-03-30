import { tryFetch, TryFetchParams } from './tryFetch';
import { GetAuthToken, getAuthToken } from './getAuthToken';
import { assocPath } from 'ramda';

interface TryAuthFetchParams extends TryFetchParams {
  authToken?: GetAuthToken;
}

export const tryAuthFetch = async <ResponseType>({
  authToken = getAuthToken(),
  ...params
}: TryAuthFetchParams) =>
  tryFetch<ResponseType>(
    assocPath(
      ['request', 'headers', 'authorization'],
      `Bearer ${authToken?.getToken}`,
      params,
    ),
  );
