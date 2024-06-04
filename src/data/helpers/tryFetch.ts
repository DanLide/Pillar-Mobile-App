import { is } from 'ramda';

import { LoggingService } from 'src/services';
import { getLogoutListener } from './getLogoutListener';

export class BadRequestError extends Error {
  error?: string;
  error_description?: string;
  errorCode?: number;

  constructor(error: string, error_description?: string, errorCode?: number) {
    super(error);

    this.error = error;
    this.error_description = error_description;
    this.errorCode = errorCode;
  }
}

export class AuthError extends Error {}

export interface LogoutListener {
  onServerLogout: () => void;
  onAutoLogout: () => void;
}

export type RequestError = BadRequestError | AuthError | Error;

export interface TryFetchParams {
  url: string | URL;
  request: RequestInit;
  disableLogoutOnUnauthorized?: boolean;
  logoutListener?: LogoutListener;
}

export type TErrorResponse = {
  message?: string;
};

export const tryFetch = async <ResponseType>({
  url,
  request,
  disableLogoutOnUnauthorized,
  logoutListener = getLogoutListener(),
}: TryFetchParams) => {
  let data;
  let response;

  try {
    response = await fetch(is(URL, url) ? url.toString() : url, request);

    const contentType = response.headers.get('content-type');

    data =
      contentType?.indexOf('application/json') !== -1
        ? await response.json()
        : await response.text();

    if (response.ok) {
      return data as ResponseType;
    } else if (response.status === 401 || response.status === 403) {
      if (!disableLogoutOnUnauthorized) logoutListener.onServerLogout();
      throw new AuthError((data as TErrorResponse)?.message || 'Unauthorized');
    } else if (response.status === 400) {
      throw data as BadRequestError;
    } else {
      throw Error(`Error with ${response.status} code!`);
    }
  } catch (error) {
    LoggingService.logAPIException(error, {
      statusCode: response?.status,
      url,
      method: request.method,
      request,
      response: data,
    });
    throw error;
  }
};
