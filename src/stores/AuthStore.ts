import { action, makeObservable, observable, computed } from "mobx";
import { LogoutListener } from "../data/helpers/tryFetch";
export class AuthStore implements LogoutListener {
  @observable isLoggedIn?: boolean;
  private token?: string;
  private isTnC?: boolean;
  private isLanguage?: boolean;
  private username?: string;
  private companyNumber?: string;
  private permissionSet1?: number;
  private permissionSet2?: number;
  private msoID?: number;
  private facilityID?: string;

  constructor() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguage = undefined;

    this.isLoggedIn = false;
    makeObservable(this);
  }

  @computed public get getToken() {
    return this.token;
  }

  @computed public get isTnCSelected() {
    return this.isTnC;
  }

  @computed public get isLanguageSelected() {
    return this.isLanguage;
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

  @action setUsername(value?: string) {
    this.username = value;
  }

  @action setCompanyNumber(value?: string) {
    this.companyNumber = value;
  }

  @action setPermissionSet1(value?: number) {
    this.permissionSet1 = value;
  }

  @action setPermissionSet2(value?: number) {
    this.permissionSet2 = value;
  }

  @action setMsoID(value?: number) {
    this.msoID = value;
  }

  @action setFacilityID(value?: string) {
    this.facilityID = value;
  }

  @action logOut() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguage = undefined;
    this.isLoggedIn = false;
  }
}
