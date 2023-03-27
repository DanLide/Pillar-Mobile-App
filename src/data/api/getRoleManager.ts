import { ResponseError, tryFetch } from "../helpers/tryFetch";
import { URLProvider } from "../helpers";

interface GetRoleManagerAPIResponse {
  username: string;
  roleTypeId: number;
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = async (
  token: string
): Promise<GetRoleManagerAPIResponse | ResponseError> => {
  const url = new URLProvider().getRoleModelUrl();

  return await tryFetch<GetRoleManagerAPIResponse>(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
