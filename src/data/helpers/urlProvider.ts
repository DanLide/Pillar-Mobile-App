import { environment } from "./environment";

export class URLProvider {
  currentEnv: {
    b2c: { clientId: string; authority: string };
    modules: { pisaUser: { apiUri: string }, companies: { apiUri: string }, pisaCompanyLocation: { apiUri: string }, };
  };

  constructor() {
    this.currentEnv = environment;
  }

  getLoginUrl() {
    const url = new URL(`${this.currentEnv.b2c.authority}/oauth2/v2.0/token`);

    url.searchParams.set("grant_type", "password");
    url.searchParams.set(
      "scope",
      `openid+${this.currentEnv.b2c.clientId}+offline_access`
    );
    url.searchParams.set("client_id", this.currentEnv.b2c.clientId);

    return url;
  }

  getRoleModelUrl() {
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/RoleManager`
    );
  }

  getSingleSSOUrl(facilityID: string) {
    return new URL(
      `${this.currentEnv.modules.companies.apiUri}/api/repairFacility/${facilityID}`
    );
  }

  getMultiSSOUrl(msoID: string) {
    // TODO replace 19 with PartyRelationshipType.MsoToRepairFacility or PartyRelationshipType.DistributorToRepairFacility or PartyRelationshipType.BranchToRepairFacility
    return new URL(
      `${this.currentEnv.modules.pisaCompanyLocation.apiUri}/api/RepairFacility/${msoID}/19`
    );
  }

  getAllSSOUrl() {
    // TODO replace with constants repairFacilities + '/' + repairFacilityPrimaryContact + '/' + orgPartyRoleId
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/Account/GetAllOrganizations/3/26/1`
    );
  }

}
