import * as LoginAPI from '../api/login';
import * as GetRoleManagerAPI from '../api/getRoleManager';

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
    roleTypeId: 1,
    partyRoleId: 1,
  };

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
