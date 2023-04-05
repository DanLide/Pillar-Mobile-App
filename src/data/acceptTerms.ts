import { Task, TaskExecutor } from './helpers';
// import { acceptTermsAPI } from './api/acceptTerms';
import { AuthStore } from '../stores/AuthStore';

export const onAcceptTerms = async (authStore: AuthStore) =>
  new TaskExecutor([
    new AcceptTermsTask(),
    new SaveAcceptTermsDataTask(authStore),
  ]).execute();

export class AcceptTermsTask extends Task {
  async run(): Promise<void> {
    // await acceptTermsAPI();
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
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
