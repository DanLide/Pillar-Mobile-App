import { Task, TaskExecutor } from "./helpers";
import { getRoleManagerAPI } from "./api";

interface GetRoleManagerContext {
  token?: string;
}

export const onGetRoleManager = async (token: string) => {
  const getRoleManagerContext = {
    token: undefined,
  };
  const result = await new TaskExecutor([
    new GetRoleManagerTask(getRoleManagerContext, token),
  ]).execute();

  return result;
};

export class GetRoleManagerTask extends Task {
  loginFlowContext: GetRoleManagerContext;

  constructor(loginFlowContext: GetRoleManagerContext, token: string) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.loginFlowContext.token = token;
  }

  async run(): Promise<void> {
    await getRoleManagerAPI(this.loginFlowContext.token);
  }
}
