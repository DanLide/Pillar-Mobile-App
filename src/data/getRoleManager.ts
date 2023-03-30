import { Task, TaskExecutor } from './helpers';
import { getRoleManagerAPI } from './api';
import { AuthStore } from '../stores/AuthStore';

interface GetRoleManagerContext {
  token?: string;
}

export const onGetRoleManager = (token: string, authStore: AuthStore) => {
  const getRoleManagerContext = {
    token: undefined,
  };

  return new TaskExecutor([
    new GetRoleManagerTask(getRoleManagerContext, token, authStore),
  ]).execute();
};

export class GetRoleManagerTask extends Task {
  loginFlowContext: GetRoleManagerContext;
  authStore: AuthStore;

  constructor(
    loginFlowContext: GetRoleManagerContext,
    token: string,
    authStore: AuthStore,
  ) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.loginFlowContext.token = token;
    this.authStore = authStore;
  }

  async run(): Promise<void> {
    if (!this.loginFlowContext.token) {
      throw new Error('Login failed!');
    }

    await getRoleManagerAPI(
      { token: this.loginFlowContext.token },
      this.authStore,
    );
  }
}
