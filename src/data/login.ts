import { Task, TaskExecutor } from "./helpers";
import { loginAPI, getRoleManagerAPI, LoginAPIParams } from "./api";
import { AuthStore } from "../stores/AuthStore";

interface LoginFlowContext {
  token?: string;
  isTnC?: boolean;
  isLanguageSelected?: boolean;
}

export const onLogin = async (params: LoginAPIParams, authStore: AuthStore) => {
  const loginContext: LoginFlowContext = {
    token: undefined,
    isTnC: undefined,
    isLanguageSelected: undefined,
  };

  const result = await new TaskExecutor([
    new LoginTask(loginContext, params),
    new GetRoleManagerTask(loginContext),
    new SaveAuthDataTask(loginContext, authStore),
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
    if (!this.loginFlowContext.token) {
      throw new Error("Login failed!");
    }
    const response = await getRoleManagerAPI(this.loginFlowContext.token);

    this.loginFlowContext.isTnC = !!response.isTermsAccepted;
    this.loginFlowContext.isLanguageSelected = !!response.isLanguageSelected;
  }
}

class SaveAuthDataTask extends Task {
  loginFlowContext: LoginFlowContext;
  authStore: AuthStore;

  constructor(loginFlowContext: LoginFlowContext, authStore: AuthStore) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.authStore = authStore;
  }

  isLoginFieldsValid() {
    const { token, isTnC, isLanguageSelected } = this.loginFlowContext;
    return (
      isLanguageSelected !== undefined &&
      token !== undefined &&
      isTnC !== undefined
    );
  }

  async run() {
    const { token, isTnC, isLanguageSelected } = this.loginFlowContext;
    if (this.isLoginFieldsValid()) {
      this.authStore.setToken(token);
      this.authStore.setIsTnC(isTnC);
      this.authStore.setIsLanguageSelected(isLanguageSelected);
      this.authStore.setLoggedIn(true);
    } else {
      this.authStore.cleanAuthStore();
      throw Error("Login failed!");
    }
  }
}
