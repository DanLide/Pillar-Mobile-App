import { getLogoutListener } from "./getLogoutListener";

export interface BadRequestError {
  error?: string;
  error_description?: string;
  message?: string;
}

export class AuthError extends Error {}

export interface LogoutListener {
  onServerLogout: () => void;
}

export type RequestError = BadRequestError | AuthError | Error;

export const tryFetch = async <ResponseType>(
  url: string | URL,
  request: RequestInit,
  logoutListener = getLogoutListener()
) => {
  try {
    const response = await fetch(url, request);

    const data = await response.json();

    if (response.ok) {
      return data as ResponseType;
    } else if (response.status === 401 || response.status === 403) {
      logoutListener.onServerLogout();
      throw (new AuthError().message = data?.message || "Unauthorized");
    } else if (response.status === 400) {
      throw data as BadRequestError;
    } else {
      throw Error(`Error with ${response.status} code!`);
    }
  } catch (error) {
    throw error;
  }
};