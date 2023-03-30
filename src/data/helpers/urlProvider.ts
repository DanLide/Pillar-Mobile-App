import { environment } from './environment';

export class URLProvider {
  currentEnv: {
    b2c: { clientId: string; authority: string };
    modules: { pisaUser: { apiUri: string }; common: { apiUri: string } };
  };

  constructor() {
    this.currentEnv = environment;
  }

  getLoginUrl() {
    const url = new URL(`${this.currentEnv.b2c.authority}/oauth2/v2.0/token`);

    url.searchParams.set('grant_type', 'password');
    url.searchParams.set(
      'scope',
      `openid+${this.currentEnv.b2c.clientId}+offline_access`,
    );
    url.searchParams.set('client_id', this.currentEnv.b2c.clientId);

    return url;
  }

  getRoleModelUrl() {
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/RoleManager`,
    );
  }

  getAcceptTermsUrl(partyRoleId: number) {
    return new URL(
      `${this.currentEnv.modules.common.apiUri}/api/Common/partySetting/${partyRoleId}`,
    );
  }
}
