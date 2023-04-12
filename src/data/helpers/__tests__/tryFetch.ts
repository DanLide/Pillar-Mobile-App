import { enableFetchMocks } from 'jest-fetch-mock';
import { assoc } from 'ramda';

import { AuthError, tryFetch } from '../tryFetch';
import { AuthStore } from '../../../stores/AuthStore';
import {
  mockFetchError,
  mockFetchJSON,
  mockFetchText,
  TEST_URL,
  TRY_FETCH_PARAMS,
} from '../__mock__/tryFetch';

enableFetchMocks();

describe('tryFetch', () => {
  it('should run tryFetch with json response', async () => {
    const mockedResponse = {};

    const mockedFetchJson = mockFetchJSON(mockedResponse);

    await expect(tryFetch(TRY_FETCH_PARAMS)).resolves.toEqual(mockedResponse);
    expect(mockedFetchJson).toBeCalled();
  });

  it('should run tryFetch with text response', async () => {
    const mockedResponse = 'OK';

    const mockedFetchText = mockFetchText(mockedResponse);

    await expect(tryFetch(TRY_FETCH_PARAMS)).resolves.toBe(mockedResponse);
    expect(mockedFetchText).toBeCalled();
  });

  it('should run tryFetch with URL instance', async () => {
    const mockedResponse = 'OK';

    const url = new URL(TEST_URL);
    const params = assoc('url', url, TRY_FETCH_PARAMS);
    const mockedFetchText = mockFetchText(mockedResponse);

    await expect(tryFetch(params)).resolves.toBe(mockedResponse);
    expect(mockedFetchText).toBeCalled();
  });

  it('should throw auth error and log out user', async () => {
    const authStoreSpy = new AuthStore();
    const mockedFetchAuthError = mockFetchError({ status: 401 });

    authStoreSpy.setLoggedIn(true);

    const params = assoc('logoutListener', authStoreSpy, TRY_FETCH_PARAMS);

    expect(authStoreSpy.isLoggedIn).toBeTruthy();
    await expect(tryFetch(params)).rejects.toThrow(AuthError);
    expect(authStoreSpy.isLoggedIn).toBeFalsy();
    expect(mockedFetchAuthError).toBeCalled();
  });

  it('should throw bad request error', async () => {
    const message = 'Bad request';

    const mockedFetchAuthError = mockFetchError({ message, status: 400 });

    await expect(tryFetch(TRY_FETCH_PARAMS)).rejects.toEqual({ message });
    expect(mockedFetchAuthError).toBeCalled();
  });

  it('should throw 501 error', async () => {
    const status = 501;

    const mockedFetchAuthError = mockFetchError({ status });

    await expect(tryFetch(TRY_FETCH_PARAMS)).rejects.toThrow(status.toString());
    expect(mockedFetchAuthError).toBeCalled();
  });
});
