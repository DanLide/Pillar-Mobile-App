import { Task, TaskExecutor } from './helpers/taskExecutor';

import { TokenData } from './login';
import { authStore } from '../stores';
import { refreshTokenAPI } from './api/refreshTokenAPI';

export const refreshToken = async () => {
  const refreshTokenContext: TokenData = {};
  const result = await new TaskExecutor([
    new RefreshTokenTask(refreshTokenContext),
    new SaveTokensToStore(refreshTokenContext),
  ]).execute();

  return result;
};

export class RefreshTokenTask extends Task {
  refreshTokenContext: TokenData;

  constructor(refreshTokenContext: TokenData) {
    super();
    this.refreshTokenContext = refreshTokenContext;
  }

  async run(): Promise<void> {
    const response = await refreshTokenAPI();
    this.refreshTokenContext.token = response.access_token;
    this.refreshTokenContext.refreshToken = response.refresh_token;
    this.refreshTokenContext.tokenExpiresIn = response.expires_in;
  }
}

export class SaveTokensToStore extends Task {
  refreshTokenContext: TokenData;

  constructor(refreshTokenContext: TokenData) {
    super();
    this.refreshTokenContext = refreshTokenContext;
  }

  async run() {
    const { token, tokenExpiresIn, refreshToken } = this.refreshTokenContext;
    if (token && refreshToken && typeof tokenExpiresIn === 'number') {
      authStore.setToken(token, refreshToken, tokenExpiresIn);
    } else {
      throw Error('Token is not defined!');
    }
  }
}
