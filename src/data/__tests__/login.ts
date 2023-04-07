import { LoginFlowContext, LoginTask } from '../login';
import * as LoginAPI from '../api/login';

describe('login', () => {
  const loginContext: LoginFlowContext = {};

  it('should execute login task', async () => {
    const mockedLoginAPI = jest
      .spyOn(LoginAPI, 'loginAPI')
      .mockReturnValue(Promise.resolve(loginSuccessResponse));

    await new LoginTask(loginContext, loginParams).run();

    expect(loginContext.token).toBeDefined();
    expect(mockedLoginAPI).toBeCalled();
  });
});

const loginParams: LoginAPI.LoginAPIParams = {
  username: 'test',
  password: 'test',
};

const loginSuccessResponse: LoginAPI.LoginAPIResponse = {
  access_token: 'access_token',
  expires_in: 86400,
  refresh_token: 'refresh_token',
  token_type: 'Bearer',
};
