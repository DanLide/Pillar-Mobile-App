import jwt_decode from 'jwt-decode';

import { Task, TaskExecutor } from './helpers';
import { loginAPI, getRoleManagerAPI, LoginAPIParams } from './api';
import { AuthStore } from '../stores/AuthStore';

interface LoginFlowContext {
  token?: string;
  isTnC?: boolean;
  isLanguage?: boolean;
  partyRoleId?: number;
  username?: string;
  companyNumber?: string;
  permissionSet1?: number;
  permissionSet2?: number;
  msoID?: number;
  facilityID?: string;
}

export const onLogin = async (params: LoginAPIParams, authStore: AuthStore) => {
  const loginContext: LoginFlowContext = {
    token: undefined,
    isTnC: undefined,
    isLanguage: undefined,
  };

  const result = await new TaskExecutor([
    new LoginTask(loginContext, params),
    new GetRoleManagerTask(loginContext),
    new JWTParserTask(loginContext),
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
      throw new Error('Login failed!');
    }
    const response = await getRoleManagerAPI(this.loginFlowContext.token);

    this.loginFlowContext.isTnC = !!response.isTermsAccepted;
    this.loginFlowContext.isLanguage = !!response.isLanguageSelected;
    this.loginFlowContext.partyRoleId = response.partyRoleId;
  }
}

class JWTParserTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  isTokenValid(decodedToken) {
    return (
      decodedToken.name !== undefined &&
      decodedToken.extension_permissionSet1 !== undefined &&
      decodedToken.extension_permissionSet2 !== undefined
    );
  }

  makeValidField<Type>(value: Type) {
    if (value == '0') {
      return undefined;
    }

    return value;
  }

  async run() {
    const decodedToken = jwt_decode(this.loginFlowContext.token);

    if (!this.isTokenValid(decodedToken)) {
      throw Error('Token is not valid!');
    }

    this.loginFlowContext.username = this.makeValidField<string>(
      decodedToken.name,
    );
    this.loginFlowContext.companyNumber = this.makeValidField<string>(
      decodedToken.extension_companyNumber,
    );
    this.loginFlowContext.permissionSet1 = this.makeValidField<number>(
      +decodedToken.extension_permissionSet1,
    );
    this.loginFlowContext.permissionSet2 = this.makeValidField<number>(
      +decodedToken.extension_permissionSet2,
    );
    this.loginFlowContext.msoID = this.makeValidField<number>(
      +decodedToken.extension_msoPisaID,
    );
    this.loginFlowContext.facilityID = this.makeValidField<string>(
      decodedToken.extension_repairFacilityID,
    );
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

  isLoginContextValid() {
    const { token, isTnC, isLanguage } = this.loginFlowContext;
    return (
      isLanguage !== undefined && token !== undefined && isTnC !== undefined
    );
  }

  async run() {
    const { token, isTnC, isLanguage, partyRoleId } = this.loginFlowContext;
    if (this.isLoginContextValid()) {
      this.authStore.setToken(token);
      this.authStore.setIsTnC(isTnC);
      this.authStore.setIsLanguage(isLanguage);

      this.authStore.setPartyRoleId(partyRoleId);
      this.authStore.setUsername(this.loginFlowContext.username);
      this.authStore.setCompanyNumber(this.loginFlowContext.companyNumber);
      this.authStore.setPermissionSet1(this.loginFlowContext.permissionSet1);
      this.authStore.setPermissionSet2(this.loginFlowContext.permissionSet2);
      this.authStore.setMsoID(this.loginFlowContext.msoID);
      this.authStore.setFacilityID(this.loginFlowContext.facilityID);

      this.authStore.setLoggedIn(true);
    } else {
      this.authStore.logOut();
      throw Error('Login failed!');
    }
  }
}
