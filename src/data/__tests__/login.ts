import { GetRoleManagerTask, LoginFlowContext, LoginTask } from '../login';
import {
  LOGIN_PARAMS,
  LOGIN_RESPONSE,
  mockGetRoleManagerError,
  mockGetRoleManagerSuccess,
  mockLoginError,
  mockLoginSuccess,
} from '../__mocks__/login';

describe('login', () => {
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
});
