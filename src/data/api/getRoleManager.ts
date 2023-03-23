import { tryFetch } from "../helpers/tryFetch";
import { environment } from "../helpers/environment";
import { URLProvider } from "../helpers";

interface GetRoleManagerAPIResponse {
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = async (
  token: string
): Promise<GetRoleManagerAPIResponse> => {
  const url = new URLProvider().getRoleModelUrl();

  return await tryFetch<GetRoleManagerAPIResponse>(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
