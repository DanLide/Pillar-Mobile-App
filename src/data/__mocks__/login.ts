import * as LoginAPI from '../api/login';
import * as GetRoleManagerAPI from '../api/getRoleManager';
import { LoginFlowContext } from '../login';

export const mockLoginSuccess = () =>
  jest
    .spyOn(LoginAPI, 'loginAPI')
    .mockReturnValue(Promise.resolve(LOGIN_RESPONSE));

export const mockLoginError = () =>
  jest.spyOn(LoginAPI, 'loginAPI').mockImplementation(() => {
    throw new Error();
  });

export const mockGetRoleManagerSuccess = () =>
  jest
    .spyOn(GetRoleManagerAPI, 'getRoleManagerAPI')
    .mockReturnValue(Promise.resolve(GET_ROLE_MANAGER_RESPONSE));

export const mockGetRoleManagerError = () =>
  jest.spyOn(GetRoleManagerAPI, 'getRoleManagerAPI').mockImplementation(() => {
    throw new Error();
  });

export const LOGIN_PARAMS: LoginAPI.LoginAPIParams = {
  username: 'test',
  password: 'test',
};

export const LOGIN_RESPONSE: LoginAPI.LoginAPIResponse = {
  access_token: 'access_token',
  expires_in: 86400,
  refresh_token: 'refresh_token',
  token_type: 'Bearer',
};

export const GET_ROLE_MANAGER_RESPONSE: GetRoleManagerAPI.GetRoleManagerAPIResponse =
  {
    username: 'test',
    roleTypeId: 14,
    partyRoleId: 22273,
    orgPartyRoleID: 653,
    isTermsAccepted: false,
    languageTypeId: 0,
  };

export const LOGIN_CONTEXT: LoginFlowContext = {
  token: LOGIN_RESPONSE.access_token,
  isLanguage: !!GET_ROLE_MANAGER_RESPONSE.languageTypeId,
  isTnC: GET_ROLE_MANAGER_RESPONSE.isTermsAccepted,
};

export const JWT_DECODE_RESULT = {
  name: 'test',
  extension_companyNumber: 'e6144766-bc5f-44d0-8352-080e981d6f8a',
  extension_permissionSet1: '18446462598732840959',
  extension_permissionSet2: '15852741057088323583',
  extension_msoPisaID: 1,
  extension_repairFacilityID: 1,
};
