import { environment } from "../helpers/environment";
import { createRequest } from "../helpers/createRequest";

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

export const loginAPI = async (
  params: LoginAPIParams
): Promise<LoginAPIResponse> => {
  const url = new URL(`${environment.b2c.authority}/oauth2/v2.0/token`);

  url.searchParams.set("password", params.password);
  url.searchParams.set("username", params.username);
  url.searchParams.set("grant_type", "password");
  url.searchParams.set(
    "scope",
    `openid+${environment.b2c.clientId}+offline_access`
  );
  url.searchParams.set("client_id", environment.b2c.clientId);
  url.search = decodeURIComponent(url.search);

  const response = await createRequest<LoginAPIResponse>(url, {
    method: "POST",
  });

  return response;
};
