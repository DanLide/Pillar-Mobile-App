import { URLProvider } from "../helpers";
import { tryFetch } from "../helpers/tryFetch";

export interface LoginAPIParams {
  username: string;
  password: string;
}

interface LoginAPIResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const loginAPI = (params: LoginAPIParams) => {
  const url = new URLProvider().getLoginUrl();

  url.searchParams.set("password", params.password);
  url.searchParams.set("username", params.username);
  url.search = decodeURIComponent(url.search);

  return tryFetch<LoginAPIResponse>(url, {
    method: "POST",
  });
};