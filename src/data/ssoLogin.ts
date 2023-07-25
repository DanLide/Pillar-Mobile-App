import AzureAuth from 'react-native-azure-auth';

import { Task, TaskExecutor } from './helpers';
import { LoginFlowContext } from './login';

const CLIENT_ID = '198e2599-5fe6-45f5-9426-72ff46dbc80b';
const SCOPE = 'openid profile offline_access';

const azureAuth = new AzureAuth({
  clientId: CLIENT_ID,
  redirectUri: 'msauth.com.globallogic.3m.repairstack.dev://auth', // TODO
  tenant: '3maaddev.onmicrosoft.com',
});

export const ssoLogin = async () => {
  const loginFlowContext: LoginFlowContext = {};
  const result = await new TaskExecutor([
    new SSOLoginTask(loginFlowContext),
  ]).execute();

  return result;
};

export class SSOLoginTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  async run(): Promise<void> {
    try {
      const tokens = await azureAuth.webAuth.authorize({
        scope: SCOPE,
      });
      console.log('CRED>>>', tokens);
    } catch (error) {
      console.log('Error during Azure operation', error);
    }
  }
}
