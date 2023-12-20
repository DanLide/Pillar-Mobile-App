import { action, makeObservable, observable, computed } from 'mobx';

export class LoginLinkStore {
  @observable loginLink: string | null;

  constructor() {
    this.loginLink = null;

    makeObservable(this);
  }

  @computed
  get getLoginLink() {
    return this.loginLink;
  }

  @action setLoginLink(link: string) {
    this.loginLink = link;
  }

  @action clear() {
    this.loginLink = null;
  }
}
