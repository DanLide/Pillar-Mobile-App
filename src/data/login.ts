import i18n from 'i18next';
import jwt_decode from 'jwt-decode';

import { jobsStore } from '../modules/jobsList/stores';
import { SSOModel } from '../modules/sso/stores/SelectSSOStore';
import { ssoStore } from '../stores';
import { AuthStore } from '../stores/AuthStore';
import { getRoleManagerAPI, loginAPI, LoginAPIParams } from './api';
import {
  adminSSOAPI,
  distributorSSOAPI,
  multiSSOAPI,
  MultiSSOAPIResponse,
  singleSSOAPI,
  SingleSSOAPIResponse,
} from './api/ssoAPI';
import ExtendedError from './error/ExtendedError';
import { Task, TaskExecutor } from './helpers';
import { Utils, mapSingle } from './helpers/utils';
import { permissionProvider } from './providers';
import { LoginType } from 'src/navigation/types';
import { RoleType, PartyRelationshipType } from 'src/constants/common.enum';
import { includes } from 'ramda';

export interface TokenData {
  token?: string;
  refreshToken?: string;
  tokenExpiresIn?: number;
  type?: LoginType;
}

export interface LoginFlowContext extends TokenData {
  token?: string;
  isTnC?: boolean;
  partyRoleId?: number;
  orgPartyRoleId?: number;
  username?: string;
  companyNumber?: string;
  permissionSet1?: string;
  permissionSet2?: string;
  msoID?: number;
  facilityID?: string;
  name?: string;
  roleTypeId?: number;
  roleTypeDescription?: string;
}

export const onLogin = async (
  params: LoginAPIParams,
  authStore: AuthStore,
  type?: LoginType,
) => {
  const loginContext: LoginFlowContext = {
    token: undefined,
    isTnC: undefined,
    type,
  };

  const result = await new TaskExecutor([
    new LoginTask(loginContext, params),
    new GetRoleManagerTask(loginContext),
    new JWTParserTask(loginContext),
    new GetSSOTask(loginContext),
    new SaveAuthDataTask(loginContext, authStore, params.username),
  ]).execute();

  return result;
};

export const onLoginWithToken = async (token: string, authStore: AuthStore) => {
  const loginContext: LoginFlowContext = {
    token,
    isTnC: undefined,
    type: LoginType.LoginShopDevice,
  };

  return new TaskExecutor([
    new GetRoleManagerTask(loginContext),
    new JWTParserTask(loginContext),
    new GetSSOTask(loginContext),
    new SaveAuthDataTask(loginContext, authStore),
  ]).execute();
};

class LoginTask extends Task {
  loginFlowContext: LoginFlowContext;
  params: LoginAPIParams;

  constructor(loginFlowContext: LoginFlowContext, params: LoginAPIParams) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.params = params;
  }

  async run(): Promise<void> {
    if (this.loginFlowContext.token) return;

    const response = await loginAPI(this.params);
    this.loginFlowContext.token = response.access_token;
    this.loginFlowContext.refreshToken = response.refresh_token;
    this.loginFlowContext.tokenExpiresIn = response.expires_in;
  }
}

class GetRoleManagerTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  async run(): Promise<void> {
    if (!this.loginFlowContext.token) {
      throw new Error(i18n.t('loginFailed'));
    }

    const response = await getRoleManagerAPI(this.loginFlowContext.token);

    // Application should not allow to login other shop RF manager users for a configured Shop.
    if (
      ssoStore?.getCurrentSSO?.pisaId &&
      response.orgRoleTypeID === RoleType.RepairFacility &&
      response.orgPartyRoleID !== ssoStore?.getCurrentSSO?.pisaId
    ) {
      throw new Error(i18n.t('loginFailed'));
    }

    this.loginFlowContext.isTnC = !!response.isTermsAccepted;
    this.loginFlowContext.partyRoleId = response.partyRoleId;
    this.loginFlowContext.orgPartyRoleId = response.orgPartyRoleID;
    this.loginFlowContext.roleTypeDescription = response.roleTypeDescription;
    this.loginFlowContext.roleTypeId = response.roleTypeId;
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
      throw Error(i18n.t('tokenIsNotValid'));
    }

    this.loginFlowContext.username = Utils.zeroToUndefined<string>(
      decodedToken.name,
    );
    this.loginFlowContext.companyNumber = Utils.zeroToUndefined<string>(
      decodedToken.extension_companyNumber,
    );
    this.loginFlowContext.permissionSet1 = Utils.zeroToUndefined<string>(
      decodedToken.extension_permissionSet1,
    );
    this.loginFlowContext.permissionSet2 = Utils.zeroToUndefined<string>(
      decodedToken.extension_permissionSet2,
    );
    this.loginFlowContext.msoID = Utils.zeroToUndefined<number>(
      +decodedToken.extension_msoPisaID,
    );
    this.loginFlowContext.facilityID = Utils.zeroToUndefined<string>(
      decodedToken.extension_repairFacilityID,
    );
    this.loginFlowContext.name = Utils.zeroToUndefined<string>(
      decodedToken.name,
    );
  }
}

class GetSSOTask extends Task {
  loginFlowContext: LoginFlowContext;

  constructor(loginFlowContext: LoginFlowContext) {
    super();
    this.loginFlowContext = loginFlowContext;
  }

  async run(): Promise<void> {
    if (ssoStore.getIsDeviceConfiguredBySSO) return;

    ssoStore.clear();

    if (!this.loginFlowContext.token) {
      throw new Error(i18n.t('loginFailed'));
    }

    jobsStore.clear();
    const ssoList = await this.fetchSSOList();

    if (ssoList === undefined) {
      throw new Error(i18n.t('ssoFetchingError'));
    }
    ssoStore.setSSOList(ssoList);

    if (ssoList.length === 1) {
      // make a single sso as current
      ssoStore.setCurrentSSO(ssoList[0]);
    }
  }

  private async fetchSSOList(): Promise<SSOModel[] | undefined> {
    const { facilityID, token, roleTypeId, orgPartyRoleId } =
      this.loginFlowContext;

    if (facilityID && token) {
      // is SSO user
      const response: SingleSSOAPIResponse = await singleSSOAPI(
        token,
        facilityID,
      );
      const res = mapSingle(response);
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
    } else if (
      orgPartyRoleId &&
      includes(roleTypeId, [
        RoleType.DistributorStandard,
        RoleType.BranchDriver,
        RoleType.BranchManager,
        RoleType.DistributorRegionalManager,
        RoleType.DistributorAdmin,
      ])
    ) {
      // is Distributor user
      let roleTypeFacilityId = PartyRelationshipType.BranchToRepairFacility;
      if (
        roleTypeId === RoleType.DistributorRegionalManager ||
        roleTypeId === RoleType.DistributorAdmin
      ) {
        roleTypeFacilityId = PartyRelationshipType.DistributorToRepairFacility;
      }
      const response: MultiSSOAPIResponse = await distributorSSOAPI({
        token: token!,
        partyRoleId: orgPartyRoleId,
        roleTypeFacilityId,
      });
      return this.mapMulti(response);
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
}

class SaveAuthDataTask extends Task {
  loginFlowContext: LoginFlowContext;
  authStore: AuthStore;
  loginUsername?: string;

  constructor(
    loginFlowContext: LoginFlowContext,
    authStore: AuthStore,
    loginUsername?: string,
  ) {
    super();
    this.loginFlowContext = loginFlowContext;
    this.authStore = authStore;
    this.loginUsername = loginUsername;
  }

  isLoginContextValid() {
    const { token, isTnC } = this.loginFlowContext;
    return token !== undefined && isTnC !== undefined;
  }

  async run() {
    const {
      token,
      isTnC,
      partyRoleId,
      permissionSet1,
      permissionSet2,
      roleTypeDescription,
      refreshToken,
      tokenExpiresIn,
      type,
    } = this.loginFlowContext;

    if (this.isLoginContextValid()) {
      this.authStore.setPermissionSets([permissionSet1, permissionSet2]);

      if (
        type === LoginType.ConfigureShopDevice &&
        !permissionProvider.userPermissions.configureShop
      ) {
        this.authStore.resetPermissionSet();
        throw new ExtendedError(
          'This account doesn’t have permission to configure device.',
          'no_permission',
        );
      }

      switch (type) {
        case LoginType.LoginShopDevice: {
          ssoStore.setDeviceConfiguration(true);
          break;
        }
        case LoginType.ConfigureShopDevice: {
          ssoStore.setDeviceConfiguration(false);
          break;
        }
        default:
          ssoStore.setDeviceConfiguration(undefined);
          break;
      }

      this.authStore.setToken(token, refreshToken, tokenExpiresIn);
      this.authStore.setIsTnC(isTnC);
      this.authStore.setRoleTypeDescription(roleTypeDescription);

      this.authStore.setPartyRoleId(partyRoleId);
      this.authStore.setUsername(this.loginFlowContext.username);
      this.authStore.setLoginUsername(this.loginUsername);
      this.authStore.setCompanyNumber(this.loginFlowContext.companyNumber);

      this.authStore.setMsoID(this.loginFlowContext.msoID);
      this.authStore.setFacilityID(this.loginFlowContext.facilityID);
      this.authStore.setName(this.loginFlowContext.name);

      this.authStore.setLoggedIn(true);
    } else {
      this.authStore.logOut();
      throw Error(i18n.t('loginFailed'));
    }
  }
}

export const exportedForTesting = {
  LoginTask,
  GetRoleManagerTask,
  JWTParserTask,
  SaveAuthDataTask,
};
