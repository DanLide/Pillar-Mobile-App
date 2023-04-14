import { enableFetchMocks } from 'jest-fetch-mock';
import { assoc } from 'ramda';

import { AuthError } from '../tryFetch';
import { AuthStore } from '../../../stores/AuthStore';
import { TRY_FETCH_PARAMS } from '../__mock__/tryFetch';
import { mockAuthFetch } from '../__mock__/tryAuthFetch';
import { tryAuthFetch } from '../tryAuthFetch';

enableFetchMocks();

describe('tryAuthFetch', () => {
  it('should run tryAuthFetch with auth token', async () => {
    const mockedResponse = {};
    const authStoreSpy = new AuthStore();
    const mockedFetchAuth = mockAuthFetch(mockedResponse);

    authStoreSpy.setToken('token');

    const params = assoc('authToken', authStoreSpy, TRY_FETCH_PARAMS);

    expect(authStoreSpy.getToken).toBeDefined();
    await expect(tryAuthFetch(params)).resolves.toEqual(mockedResponse);
    expect(mockedFetchAuth).toBeCalled();
  });

  it('should throw AuthError when no token provided', async () => {
    const mockedResponse = {};
    const authStoreSpy = new AuthStore();
    const mockedFetchAuth = mockAuthFetch(mockedResponse);

    const params = assoc('authToken', authStoreSpy, TRY_FETCH_PARAMS);

    expect(authStoreSpy.getToken).toBeUndefined();
    await expect(tryAuthFetch(params)).rejects.toThrow(AuthError);
    expect(mockedFetchAuth).toBeCalled();
  });
});
