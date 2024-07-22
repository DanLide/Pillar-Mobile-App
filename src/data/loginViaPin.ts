import { Task, TaskExecutor } from './helpers';
import { getSSORNToken } from 'src/helpers/storage';
import { getLoginLinkAPI, setPinAPI } from 'src/data/api/login';
import { LoginLinkStore } from 'src/modules/login/stores';

interface SetPinContext {
  rnToken: string;
  b2cUserId: string;
  pin: string;
}

export const onSetPin = async (
  b2cUserId: string,
  pin: string,
  store: LoginLinkStore,
) => {
  const setPinContext: SetPinContext = { rnToken: '', b2cUserId, pin };

  return new TaskExecutor([
    new GetRNToken(setPinContext),
    new SetPinTask(setPinContext),
    new GetLoginLink(setPinContext, store),
  ]).execute();
};

export const onLoginWithPin = async (
  b2cUserId: string,
  pin: string,
  store: LoginLinkStore,
) => {
  const setPinContext: SetPinContext = { rnToken: '', b2cUserId, pin };

  return new TaskExecutor([
    new GetRNToken(setPinContext),
    new GetLoginLink(setPinContext, store),
  ]).execute();
};

class GetRNToken extends Task {
  setPinContext: SetPinContext;

  constructor(setPinContext: SetPinContext) {
    super();
    this.setPinContext = setPinContext;
  }

  async run() {
    const rnToken = getSSORNToken();

    if (!rnToken) throw new Error();

    this.setPinContext.rnToken = rnToken.rnToken;
  }
}

export class SetPinTask extends Task {
  setPinContext: SetPinContext;

  constructor(setPinContext: SetPinContext) {
    super();
    this.setPinContext = setPinContext;
  }

  async run() {
    const { rnToken, b2cUserId, pin } = this.setPinContext;

    await setPinAPI(rnToken, b2cUserId, pin);
  }
}

class GetLoginLink extends Task {
  setPinContext: SetPinContext;
  store: LoginLinkStore;

  constructor(setPinContext: SetPinContext, store: LoginLinkStore) {
    super();
    this.setPinContext = setPinContext;
    this.store = store;
  }

  async run() {
    const { rnToken, b2cUserId, pin } = this.setPinContext;

    const link = await getLoginLinkAPI(rnToken, b2cUserId, pin);

    this.store.setLoginLink(link);
  }
}
