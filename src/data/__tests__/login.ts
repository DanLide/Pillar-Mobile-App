import jwt_decode from 'jwt-decode';
import { clone } from 'ramda';

import { exportedForTesting, LoginFlowContext } from '../login';
import { AuthStore } from '../../stores/AuthStore';
import {
  JWT_DECODE_RESULT,
  LOGIN_CONTEXT,
  LOGIN_PARAMS,
  mockGetRoleManagerError,
  mockGetRoleManagerSuccess,
  mockLoginError,
  mockLoginSuccess,
} from '../__mocks__/login';

jest.mock('jwt-decode');

const { LoginTask, GetRoleManagerTask, JWTParserTask, SaveAuthDataTask } =
  exportedForTesting;

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
    const loginContext: LoginFlowContext = clone(LOGIN_CONTEXT);

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
    const loginContext: LoginFlowContext = clone(LOGIN_CONTEXT);

    const mockedGetRoleManagerSuccess = mockGetRoleManagerError();
    const getRoleManagerTask = new GetRoleManagerTask(loginContext);

    await expect(getRoleManagerTask.run()).rejects.toThrow();
    expect(loginContext.partyRoleId).toBeUndefined();
    expect(mockedGetRoleManagerSuccess).toBeCalled();
  });

  it('should execute JWTParser task', async () => {
    const loginContext = clone(LOGIN_CONTEXT);

    mockedJWTDecode.mockReturnValue(JWT_DECODE_RESULT);
    const jwtParserTask = new JWTParserTask(loginContext);

    await expect(jwtParserTask.run()).resolves.not.toThrow();
    expect(loginContext.username).toBeDefined();
    expect(loginContext.permissionSet1).toBeDefined();
    expect(loginContext.permissionSet2).toBeDefined();
    expect(mockedJWTDecode).toBeCalledTimes(1);
  });

  it('should throw invalid token error on JWTParser task', async () => {
    const loginContext: LoginFlowContext = clone(LOGIN_CONTEXT);

    mockedJWTDecode.mockReturnValue({});
    const jwtParserTask = new JWTParserTask(loginContext);

    await expect(jwtParserTask.run()).rejects.toThrow('Token is not valid');
    expect(loginContext.username).toBeUndefined();
    expect(loginContext.permissionSet1).toBeUndefined();
    expect(loginContext.permissionSet2).toBeUndefined();
    expect(mockedJWTDecode).toBeCalledTimes(1);
  });

  it('should execute SaveAuthData task', async () => {
    const loginContext: LoginFlowContext = clone(LOGIN_CONTEXT);
    const authStore = new AuthStore();

    const saveAuthDataTask = new SaveAuthDataTask(loginContext, authStore);

    await expect(saveAuthDataTask.run()).resolves.not.toThrow();
    expect(authStore.getToken).toBeDefined();
    expect(authStore.isLanguageSelected).toBeDefined();
    expect(authStore.isTnCSelected).toBeDefined();
    expect(authStore.isLoggedIn).toBeTruthy();
  });

  it('should throw login failed error on SaveAuthData task', async () => {
    const loginContext: LoginFlowContext = {};
    const authStore = new AuthStore();

    const saveAuthDataTask = new SaveAuthDataTask(loginContext, authStore);

    await expect(saveAuthDataTask.run()).rejects.toThrow('Login failed');
    expect(authStore.getToken).toBeUndefined();
    expect(authStore.isLanguageSelected).toBeUndefined();
    expect(authStore.isTnCSelected).toBeUndefined();
    expect(authStore.isLoggedIn).toBeFalsy();
  });
});
