import { action, makeObservable, observable } from "mobx";

interface LoginForm {
  username: string;
  password: string;
}

export class LoginFormStore implements LoginForm {
  @observable username: string;
  @observable password: string;

  constructor() {
    this.username = "testusermobile";
    this.password = "Password123!";

    makeObservable(this);
  }

  @action setUsername(value: string) {
    this.username = value;
  }

  @action setPassword(value: string) {
    this.password = value;
  }
}
