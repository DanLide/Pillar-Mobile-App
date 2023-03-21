import { action, computed, makeObservable, observable } from 'mobx'

export default class LoginFormStore {
  protected AuthStore: any
  @observable login: string
  constructor(AuthStore: any) {
    this.AuthStore = AuthStore
    this.login = ''
    makeObservable(this)
  }

  @action setLogin(value: string) {
    this.login = value
  }
}
