import fetchMock from 'jest-fetch-mock';
import { TryFetchParams } from '../tryFetch';

export const mockFetchJSON = <T>(response: T) =>
  fetchMock.mockResponseOnce(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

export const mockFetchText = (response: string) =>
  fetchMock.mockResponseOnce(response, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });

export const mockFetchError = ({ message = '', status = 500 }) =>
  fetchMock.mockResponseOnce(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const TEST_URL = 'http://localhost:8080';

export const TRY_FETCH_PARAMS: TryFetchParams = {
  url: TEST_URL,
  request: { method: 'POST' },
};
