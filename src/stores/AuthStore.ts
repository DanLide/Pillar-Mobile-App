import { action, makeObservable, observable, computed } from "mobx";
import { LogoutListener } from "../data/helpers/tryFetch";

interface Auth {
  token?: string;
  isTnC?: boolean;
  isLanguageSelected?: boolean;
  isLoggedIn?: boolean;
}

export class AuthStore implements Auth, LogoutListener {
  protected AuthStore: any;

  @observable isLoggedIn?: boolean;
  private token?: string;
  private isTnC?: boolean;
  private isLanguageSelected?: boolean;

  constructor(AuthStore: any) {
    this.AuthStore = AuthStore;

    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguageSelected = undefined;

    this.isLoggedIn = false;
    makeObservable(this);
  }

  @computed public get getToken() {
    return this.token;
  }

  @computed public get getIsTnC() {
    return this.isTnC;
  }

  @computed public get getIsLanguageSelected() {
    return this.isLanguageSelected;
  }

  onServerLogout() {
    this.cleanAuthStore();
  }

  @action setToken(token: string) {
    this.token = token;
  }

  @action setIsTnC(isTnC: boolean) {
    this.isTnC = isTnC;
  }

  @action setIsLanguageSelected(isLanguageSelected: boolean) {
    this.isLanguageSelected = isLanguageSelected;
  }

  @action setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action cleanAuthStore() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguageSelected = undefined;
    this.isLoggedIn = false;
  }
}
