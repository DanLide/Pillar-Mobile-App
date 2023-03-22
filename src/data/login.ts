import { Task, TaskExecutor } from "./helpers";
import { loginAPI, getRoleManagerAPI, LoginAPIParams } from "./api";

interface LoginFlowContext {
  token?: string;
  isTnC?: boolean;
  isLanguageSelected?: boolean;
}

export const login = async (params: LoginAPIParams) => {
  const loginContext: LoginFlowContext = {
    token: undefined,
    isTnC: undefined,
    isLanguageSelected: undefined,
  };

  const result = await new TaskExecutor([
    new LoginTask(loginContext, params),
    new GetRoleManagerTask(loginContext),
  ]).execute();

  return result;
};

export class LoginTask extends Task {
  loginFlowContext: LoginFlowContext;
  params: LoginAPIParams;

  constructor(loginFlowContext: LoginFlowContext, params: LoginAPIParams) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.params = params;
  }

  async run(): Promise<void> {
    const response = await loginAPI(this.params);
    this.loginFlowContext.token = response.access_token;
  }
}

export class GetRoleManagerTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  async run(): Promise<void> {
    const response = await getRoleManagerAPI(this.loginFlowContext.token);
    this.loginFlowContext.isTnC = !!response.isTermsAccepted;
    this.loginFlowContext.isLanguageSelected = !!response.isLanguageSelected;
  }
}
