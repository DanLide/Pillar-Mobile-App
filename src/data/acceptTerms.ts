import { AuthError, Task, TaskExecutor } from './helpers';
import { acceptTermsAPI } from './api/acceptTerms';
import { AuthStore } from '../stores/AuthStore';

export const onAcceptTerms = async (authStore: AuthStore) =>
  new TaskExecutor([
    new AcceptTermsTask(authStore),
    new SaveAcceptTermsDataTask(authStore),
  ]).execute();

export class AcceptTermsTask extends Task {
  authStore: AuthStore;

  constructor(authStore: AuthStore) {
    super();
    this.authStore = authStore;
  }

  async run(): Promise<void> {
    const partyRoleId = this.authStore.getPartyRoleId;

    if (!partyRoleId) throw new AuthError('Login failed!');

    await acceptTermsAPI({ partyRoleId });
  }
}

class SaveAcceptTermsDataTask extends Task {
  authStore: AuthStore;

  constructor(authStore: AuthStore) {
    super();
    this.authStore = authStore;
  }

  async run() {
    this.authStore.setIsTnC(true);
  }
}
