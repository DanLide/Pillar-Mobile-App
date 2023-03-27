import { action, makeObservable, observable } from "mobx";

interface Auth {
  token?: string;
  isTnC?: boolean;
  isLanguageSelected?: boolean;
  isLoggedIn?: boolean;
}

export class AuthStore implements Auth {
  protected AuthStore: any;

  @observable token?: string;
  @observable isTnC?: boolean;
  @observable isLanguageSelected?: boolean;
  @observable isLoggedIn?: boolean;

  constructor(AuthStore: any) {
    this.AuthStore = AuthStore;

    makeObservable(this);
  }

  @action setLoggedInData(
    token: string,
    isTnC: boolean,
    isLanguageSelected: boolean
  ) {
    this.token = token;
    this.isTnC = isTnC;
    this.isLanguageSelected = isLanguageSelected;
    this.isLoggedIn = true;
  }

  @action cleanAuthStore() {
    this.token = undefined;
    this.isTnC = undefined;
    this.isLanguageSelected = undefined;
  }
}
