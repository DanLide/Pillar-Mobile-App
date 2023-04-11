import jwt_decode from 'jwt-decode';

import {
  GetRoleManagerTask,
  JWTParserTask,
  LoginFlowContext,
  LoginTask,
} from '../login';
import {
  JWT_DECODE_RESULT,
  LOGIN_PARAMS,
  LOGIN_RESPONSE,
  mockGetRoleManagerError,
  mockGetRoleManagerSuccess,
  mockLoginError,
  mockLoginSuccess,
} from '../__mocks__/login';

jest.mock('jwt-decode');

describe('login', () => {
  const mockedJWTDecode = jwt_decode as jest.MockedFunction<typeof jwt_decode>;

  it('should execute Login task', async () => {
    const loginContext: LoginFlowContext = {};

    const mockedLoginSuccess = mockLoginSuccess();
    const loginTask = new LoginTask(loginContext, LOGIN_PARAMS);

    await expect(loginTask.run()).resolves.not.toThrow();
    expect(loginContext.token).toBeDefined();
    expect(mockedLoginSuccess).toBeCalled();
  });

  it('should throw error on Login task', async () => {
    const loginContext: LoginFlowContext = {};

    const mockedLoginError = mockLoginError();
    const loginTask = new LoginTask(loginContext, LOGIN_PARAMS);

    await expect(loginTask.run()).rejects.toThrow();
    expect(loginContext.token).toBeUndefined();
    expect(mockedLoginError).toBeCalled();
  });

  it('should execute GetRoleManager task', async () => {
    const loginContext: LoginFlowContext = {
      token: LOGIN_RESPONSE.access_token,
    };

    const mockedGetRoleManagerSuccess = mockGetRoleManagerSuccess();
    const getRoleManagerTask = new GetRoleManagerTask(loginContext);

    await expect(getRoleManagerTask.run()).resolves.not.toThrow();
    expect(loginContext.partyRoleId).toBeDefined();
    expect(mockedGetRoleManagerSuccess).toBeCalled();
  });

  it('should throw login failed error on GetRoleManager task', async () => {
    const loginContext: LoginFlowContext = {};

    const mockedGetRoleManagerSuccess = mockGetRoleManagerSuccess();
    const getRoleManagerTask = new GetRoleManagerTask(loginContext);

    await expect(getRoleManagerTask.run()).rejects.toThrow('Login failed');
    expect(loginContext.partyRoleId).toBeUndefined();
    expect(mockedGetRoleManagerSuccess).not.toBeCalled();
  });

  it('should throw error on GetRoleManager task', async () => {
    const loginContext: LoginFlowContext = {
      token: LOGIN_RESPONSE.access_token,
    };

    const mockedGetRoleManagerSuccess = mockGetRoleManagerError();
    const getRoleManagerTask = new GetRoleManagerTask(loginContext);

    await expect(getRoleManagerTask.run()).rejects.toThrow();
    expect(loginContext.partyRoleId).toBeUndefined();
    expect(mockedGetRoleManagerSuccess).toBeCalled();
  });

  it('should execute JWTParser task', async () => {
    const loginContext: LoginFlowContext = {
      token: LOGIN_RESPONSE.access_token,
    };

    mockedJWTDecode.mockReturnValue(JWT_DECODE_RESULT);
    const jwtParserTask = new JWTParserTask(loginContext);

    await expect(jwtParserTask.run()).resolves.not.toThrow();
    expect(loginContext.username).toBeDefined();
    expect(loginContext.permissionSet1).toBeDefined();
    expect(loginContext.permissionSet2).toBeDefined();
    expect(mockedJWTDecode).toBeCalled();
  });

  it('should throw invalid token error on JWTParser task', async () => {
    const loginContext: LoginFlowContext = {
      token: LOGIN_RESPONSE.access_token,
    };

    mockedJWTDecode.mockReturnValue({});
    const jwtParserTask = new JWTParserTask(loginContext);

    await expect(jwtParserTask.run()).rejects.toThrow('Token is not valid');
    expect(loginContext.username).toBeUndefined();
    expect(loginContext.permissionSet1).toBeUndefined();
    expect(loginContext.permissionSet2).toBeUndefined();
    expect(mockedJWTDecode).toBeCalled();
  });
});
