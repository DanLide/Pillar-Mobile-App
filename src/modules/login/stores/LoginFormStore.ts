import { action, makeObservable, observable } from "mobx";

interface LoginForm {
  username: string;
  password: string;
}

export class LoginFormStore implements LoginForm {
  protected AuthStore: any;
  @observable username: string;
  @observable password: string;

  constructor(AuthStore: any) {
    this.AuthStore = AuthStore;
    this.username = "";
    this.password = "";

    makeObservable(this);
  }

  @action setUsername(value: string) {
    this.username = value;
  }

  @action setPassword(value: string) {
    this.password = value;
  }
}
