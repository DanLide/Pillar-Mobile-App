import fetchMock from 'jest-fetch-mock';

export const mockAuthFetch = <T>(response: T) =>
  fetchMock.mockResponseOnce(req => {
    const hasAuthToken = req.headers
      .get('authorization')
      ?.replace(/^Bearer\s+/, '');

    const status = hasAuthToken ? 200 : 401;
    const body = JSON.stringify(
      hasAuthToken ? response : { message: 'Invalid token' },
    );

    return Promise.resolve({
      body,
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  });
