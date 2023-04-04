import jwt_decode from 'jwt-decode';

import { Task, TaskExecutor } from './helpers';
import { loginAPI, getRoleManagerAPI, LoginAPIParams } from './api';
import { Utils } from './helpers/utils';
import { AuthStore } from '../stores/AuthStore';
import { SSOModel } from '../stores/SSOStore';
import { ssoStore } from '../stores';
import {
  singleSSOAPI,
  multiSSOAPI,
  adminSSOAPI,
  SingleSSOAPIResponse,
  MultiSSOAPIResponse,
} from './api/ssoAPI';

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
    new GetSSOTask(loginContext),
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

  async run() {
    const decodedToken = jwt_decode(this.loginFlowContext.token);

    if (!this.isTokenValid(decodedToken)) {
      throw Error('Token is not valid!');
    }

    this.loginFlowContext.username = Utils.zeroToUndefined<string>(
      decodedToken.name,
    );
    this.loginFlowContext.companyNumber = Utils.zeroToUndefined<string>(
      decodedToken.extension_companyNumber,
    );
    this.loginFlowContext.permissionSet1 = Utils.zeroToUndefined<number>(
      +decodedToken.extension_permissionSet1,
    );
    this.loginFlowContext.permissionSet2 = Utils.zeroToUndefined<number>(
      +decodedToken.extension_permissionSet2,
    );
    this.loginFlowContext.msoID = Utils.zeroToUndefined<number>(
      +decodedToken.extension_msoPisaID,
    );
    this.loginFlowContext.facilityID = Utils.zeroToUndefined<string>(
      decodedToken.extension_repairFacilityID,
    );
  }
}

export class GetSSOTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  async run(): Promise<void> {
    ssoStore.clear();

    if (!this.loginFlowContext.token) {
      throw new Error('Login failed!');
    }

    const ssoList = await this.fetchSSOList();
    if (ssoList === undefined) {
      throw new Error('SSO fetching error!');
    }
    ssoStore.setSSOList(ssoList);

    if (ssoList.length === 1) {
      // make a single sso as current
      ssoStore.setCurrentSSO(ssoList[0]);
    }
  }

  private async fetchSSOList(): Promise<SSOModel[] | undefined> {
    if (this.loginFlowContext.facilityID !== undefined) {
      // is SSO user
      const response: SingleSSOAPIResponse = await singleSSOAPI(
        this.loginFlowContext.token!,
        this.loginFlowContext.facilityID,
      );
      const res = this.mapSingle(response);
      // return undefined if the element is undefined
      return res && [res];
    } else if (this.loginFlowContext.msoID !== undefined) {
      // is MSO user
      const response: MultiSSOAPIResponse = await multiSSOAPI(
        this.loginFlowContext.token!,
        this.loginFlowContext.msoID.toString(),
      );
      const res = this.mapMulti(response);
      return res;
    } else {
      // TODO add extra check if it is Admin. If not - throw exception
      const response: MultiSSOAPIResponse = await adminSSOAPI(
        this.loginFlowContext.token!,
      );
      const res = this.mapMulti(response);
      return res;
    }
  }

  private mapMulti(resp: MultiSSOAPIResponse): SSOModel[] | undefined {
    if (resp.length === 0) {
      return undefined;
    }
    return resp.flatMap<SSOModel>(item => {
      const pisaId = Utils.zeroToUndefined<number>(+item.partyRoleId);
      if (pisaId === undefined || Utils.isNullOrEmpty(item.name)) {
        // skip not valid
        return [];
      }
      return {
        pisaId: pisaId,
        address: item.address,
        name: item.name,
        pillarId: undefined,
        msoPillarId: Utils.isNullOrEmpty(item.msoId) ? undefined : item.msoId,
        distributorId: Utils.isNullOrEmpty(item.distributorId)
          ? undefined
          : item.distributorId,
        distributorName: Utils.isNullOrEmpty(item.distributorName)
          ? undefined
          : item.distributorName,
      };
    });
  }

  private mapSingle(resp: SingleSSOAPIResponse): SSOModel | undefined {
    const pisaId = Utils.zeroToUndefined<number>(+resp.pisaId);
    if (pisaId === undefined || Utils.isNullOrEmpty(resp.name)) {
      return undefined;
    }

    const address = [
      resp.streetAddress1,
      resp.streetAddress2,
      resp.city,
      resp.zipCode,
      resp.state,
      resp.country,
    ]
      .filter(Utils.notNullOrEmpty)
      .join(', ');

    return {
      pisaId: pisaId,
      address: address,
      name: resp.name,
      pillarId: resp.id,
      msoPillarId: resp.msoId,
      distributorId: resp.distributorId,
      distributorName: resp.distributor,
    };
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
