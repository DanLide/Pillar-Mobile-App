export class SSOStore {
  private currentSSO?: SSOModel;
  private ssoList?: SSOModel[];

  constructor() {
    this.currentSSO = undefined;
    this.ssoList = undefined;
  }

  public get getSSOList() {
    return this.ssoList;
  }

  public get getCurrentSSO() {
    return this.currentSSO;
  }

  public setSSOList(ssoList?: SSOModel[]) {
    this.ssoList = ssoList;
  }

  public setCurrentSSO(currentSSO: SSOModel) {
    this.currentSSO = currentSSO;
  }

  public clear() {
    this.currentSSO = undefined;
    this.ssoList = undefined;
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
