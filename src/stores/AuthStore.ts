import { action, makeObservable, observable, computed } from 'mobx';
import { LogoutListener } from '../data/helpers/tryFetch';
import { stocksStore } from '../modules/stocksList/stores';
import { Utils } from '../data/helpers/utils';
import { Permissions } from '../data/helpers';
import { GetAuthToken } from '../data/helpers/getAuthToken';

export class AuthStore implements LogoutListener, GetAuthToken, Permissions {
  @observable isLoggedIn?: boolean;
  private token?: string;
  private isTnC?: boolean;
  private isLanguage?: boolean;
  private partyRoleId?: number;
  private username?: string;
  private name?: string;
  private companyNumber?: string;
  private permissionSet?: bigint[];
  private msoID?: number;
  private facilityID?: string;

  constructor() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguage = undefined;
    this.permissionSet = undefined;

    this.isLoggedIn = false;
    makeObservable(this);
  }

  @computed
  get getToken() {
    return this.token;
  }

  @computed
  get isTnCSelected() {
    return this.isTnC;
  }

  @computed
  get isLanguageSelected() {
    return this.isLanguage;
  }

  @computed
  get getPartyRoleId() {
    return this.partyRoleId;
  }

  @computed
  get getPermissionSet(): bigint[] | undefined {
    return this.permissionSet;
  }
  @computed public get getFacilityID() {
    return this.facilityID;
  }

  @computed public get getName() {
    return this.name;
  }

  onServerLogout() {
    this.logOut();
  }

  @action setToken(token: string) {
    this.token = token;
  }

  @action setIsTnC(isTnC: boolean) {
    this.isTnC = isTnC;
  }

  @action setIsLanguage(isLanguage: boolean) {
    this.isLanguage = isLanguage;
  }

  @action setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action setPartyRoleId(partyRoleId?: number) {
    this.partyRoleId = partyRoleId;
  }

  @action setUsername(value?: string) {
    this.username = value;
  }

  @action setCompanyNumber(value?: string) {
    this.companyNumber = value;
  }

  @action setPermissionSets(value: (string | undefined)[]) {
    this.permissionSet = Utils.stringsToBigInts(value);
  }

  @action setMsoID(value?: number) {
    this.msoID = value;
  }

  @action setFacilityID(value?: string) {
    this.facilityID = value;
  }

  @action setName(value?: string) {
    this.name = value;
  }

  @action logOut() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguage = undefined;
    this.permissionSet = undefined;
    this.isLoggedIn = false;
    stocksStore.clear();
  }
}
