import { LoginFlowContext, LoginTask } from '../login';
import * as LoginAPI from '../api/login';

describe('login', () => {
  it('should execute login task', async () => {
    const loginContext: LoginFlowContext = {};

    const mockedLoginSuccess = jest
      .spyOn(LoginAPI, 'loginAPI')
      .mockReturnValue(Promise.resolve(LOGIN_RESPONSE));

    const loginTask = new LoginTask(loginContext, LOGIN_PARAMS);

    await expect(loginTask.run()).resolves.not.toThrowError();
    expect(loginContext.token).toBeDefined();
    expect(mockedLoginSuccess).toBeCalled();
  });

  it('should throw error on login task', async () => {
    const loginContext: LoginFlowContext = {};

    const mockedLoginError = jest
      .spyOn(LoginAPI, 'loginAPI')
      .mockImplementation(() => {
        throw new Error();
      });

    const loginTask = new LoginTask(loginContext, LOGIN_PARAMS);

    await expect(loginTask.run()).rejects.toThrowError();
    expect(loginContext.token).toBeUndefined();
    expect(mockedLoginError).toBeCalled();
  });
});

const LOGIN_PARAMS: LoginAPI.LoginAPIParams = {
  username: 'test',
  password: 'test',
};

const LOGIN_RESPONSE: LoginAPI.LoginAPIResponse = {
  access_token: 'access_token',
  expires_in: 86400,
  refresh_token: 'refresh_token',
  token_type: 'Bearer',
};
