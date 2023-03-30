import { Task, TaskExecutor } from './helpers';
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
    const token = this.authStore.getToken;
    const partyRoleId = this.authStore.getPartyRoleId;

    if (!token || !partyRoleId) throw Error('Accept Terms failed!');

    await acceptTermsAPI({ token, partyRoleId });
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
