import { environment } from './environment';
import { AuthStore } from '../../stores/AuthStore';
import { authStore, ssoStore } from '../../stores';
import { PartyRelationshipType } from '../../constants/common.enum';
import { SSOStore } from '../../stores/SSOStore';
import {
  RemoveProductsStore,
  removeProductsStore,
} from '../../modules/removeProducts/stores';

export class URLProvider {
  authStore: AuthStore;
  ssoStore: SSOStore;
  removeProductsStore: RemoveProductsStore;
  currentEnv: {
    b2c: { clientId: string; authority: string };
    modules: {
      pisaJob: { apiUri: string };
      pisaProduct: { apiUri: string };
      pisaUser: { apiUri: string };
      common: { apiUri: string };
      companies: { apiUri: string };
      pisaCompanyLocation: { apiUri: string };
      pisaEquipment: { apiUri: string };
    };
  };

  constructor(
    auth_store = authStore,
    sso_store = ssoStore,
    remove_products_store = removeProductsStore,
  ) {
    this.authStore = auth_store;
    this.ssoStore = sso_store;
    this.removeProductsStore = remove_products_store;
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

  getAcceptTermsUrl() {
    const partyRoleId = this.authStore.getPartyRoleId;

    return new URL(
      `${this.currentEnv.modules.common.apiUri}/api/Common/partySetting/${partyRoleId}`,
    );
  }

  getSingleSSOUrl(facilityID: string) {
    return new URL(
      `${this.currentEnv.modules.companies.apiUri}/api/repairFacility/${facilityID}`,
    );
  }

  getMultiSSOUrl(msoID: string) {
    // TODO replace 19 with PartyRelationshipType.MsoToRepairFacility or PartyRelationshipType.DistributorToRepairFacility or PartyRelationshipType.BranchToRepairFacility
    return new URL(
      `${this.currentEnv.modules.pisaCompanyLocation.apiUri}/api/RepairFacility/${msoID}/19`,
    );
  }

  getAllSSOUrl() {
    // TODO replace with constants repairFacilities + '/' + repairFacilityPrimaryContact + '/' + orgPartyRoleId
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/Account/GetAllOrganizations/3/26/1`,
    );
  }

  getFetchStockUrl() {
    const partyRoleID = this.authStore.getPartyRoleId;
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/StorageByPartyRoleID/${facilityId}/${PartyRelationshipType.RepairFacilityToStorage}/${partyRoleID}/${PartyRelationshipType.UserToStorage}`,
    );
  }

  getFetchProductUrl(scanCode: string) {
    const partyRoleID = this.removeProductsStore.currentStock?.partyRoleId;
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/${partyRoleID}/${scanCode}/${facilityId}/0`,
    );
  }

  getFetchJobsBySso() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
 
    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Job/RepairFacilityJob/${facilityId}`,
    );
  }
}
