import { action, makeObservable, observable, computed } from 'mobx';
import { SSOStore } from '../../../stores/SSOStore';

export class SelectSSOStore {
  @observable searchInSSOList: string;
  @observable preselectedSSO: SSOModel | null;
  @observable private ssoData: SSOStore;

  constructor(ssoData: SSOStore) {
    makeObservable(this);
    this.ssoData = ssoData;
    this.preselectedSSO = null;
    this.searchInSSOList = '';
  }

  @computed get ssoList() {
    return this.ssoData.getSSOList;
  }

  @computed get searchedSSO() {
    if (!this.searchInSSOList) return this.ssoList;
    return this.ssoList?.filter(item => {
      const searchLowerCase = this.searchInSSOList.toLowerCase();
      const searchByName = item.name.toLowerCase().includes(searchLowerCase);
      const searchByAddress = item.address
        ?.toLowerCase()
        .includes(searchLowerCase);
      return searchByName || searchByAddress;
    });
  }

  @action setSearchInSSOList(search: string) {
    if (this.preselectedSSO) {
      this.preselectedSSO = null;
    }
    this.searchInSSOList = search;
  }

  @action preselectSSO(sso: SSOModel) {
    this.preselectedSSO = sso;
  }

  @action setCurrentSSO() {
    if (this.preselectedSSO) {
      this.ssoData.setCurrentSSO(this.preselectedSSO);
      this.preselectedSSO = null;
    }
  }
}

export interface SSOModel {
  pisaId: number;
  name: string;
  address?: string;
  pillarId?: string;
  msoPillarId?: string;
  distributorId?: string;
  distributorName?: string;
}
