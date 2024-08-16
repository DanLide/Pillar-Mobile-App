import { getSSORNToken } from 'src/helpers/storage';
import { SSOStore, SSOUser } from './../stores/SSOStore';
import { getSSOUsers } from './api/getSSOUsers';

import { Task } from './helpers';

export const fetchSSOUsers = async (ssoStore: SSOStore) => {
  try {
    await new FetchSSOUsers(ssoStore).run();
  } catch (error) {
    return error;
  }
};

class FetchSSOUsers extends Task {
  ssoStore: SSOStore;
  constructor(ssoStore: SSOStore) {
    super();
    this.ssoStore = ssoStore;
  }

  async run() {
    const rnTokenData = getSSORNToken();
    const usersList: SSOUser[] = rnTokenData
      ? await getSSOUsers(rnTokenData.rnToken)
      : [];
    this.ssoStore.setSsoUsersList(usersList);
  }
}
