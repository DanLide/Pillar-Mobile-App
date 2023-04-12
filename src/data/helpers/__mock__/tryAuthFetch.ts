import fetchMock from 'jest-fetch-mock';

export const mockAuthFetch = <T>(response: T) =>
  fetchMock.mockResponseOnce(req => {
    const isAuthHeader = req.headers.has('authorization');

    const status = isAuthHeader ? 200 : 401;
    const body = JSON.stringify(
      isAuthHeader ? response : { message: 'Invalid token' },
    );

    return Promise.resolve({
      body,
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  });
