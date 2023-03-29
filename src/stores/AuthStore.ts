import { action, makeObservable, observable, computed } from "mobx";
import { LogoutListener } from "../data/helpers/tryFetch";
export class AuthStore implements LogoutListener {
  @observable isLoggedIn?: boolean;
  private token?: string;
  private isTnC?: boolean;
  private isLanguageSelected?: boolean;

  constructor() {
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
    this.logOut();
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

  @action logOut() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguageSelected = undefined;
    this.isLoggedIn = false;
  }
}
