import { createRequest } from "../helpers/createRequest";
import { environment } from "../helpers/environment";

interface GetRoleManagerAPIResponse {
  isTermsAccepted?: boolean;
  isLanguageSelected?: boolean;
}

export const getRoleManagerAPI = async (
  token: string
): Promise<GetRoleManagerAPIResponse> => {
  const url = new URL(`${environment.modules.pisaUser.apiUri}/api/RoleManager`);
  return await createRequest<GetRoleManagerAPIResponse>(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
