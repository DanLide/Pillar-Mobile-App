import { makeObservable, observable, action, computed } from 'mobx';
import { RoleType, UserType } from 'src/constants/common.enum';

export class SSOStore {
  private currentSSO?: SSOModel;
  private ssoList?: SSOModel[];
  @observable ssoUsersList: SSOUser[] | null;
  private ssoMobileDevices?: MobileDevice[];
  @observable isDeviceConfiguredBySSO?: boolean;

  constructor() {
    makeObservable(this);

    this.currentSSO = undefined;
    this.ssoList = undefined;
    this.ssoMobileDevices = undefined;
    this.isDeviceConfiguredBySSO = undefined;
    this.ssoUsersList = null;
  }

  public get getMobileDevices() {
    return this.ssoMobileDevices;
  }

  public getCurrentMobileDevice(deviceName: string) {
    return this.ssoMobileDevices?.find(
      mobileDevice => mobileDevice.leanTecSerialNo === deviceName,
    );
  }

  public get getIsDeviceConfiguredBySSO() {
    return this.isDeviceConfiguredBySSO;
  }

  public get getSSOList() {
    return this.ssoList;
  }

  public get getCurrentSSO() {
    return this.currentSSO;
  }

  public setSSOMobileDevices(mobileDevices: MobileDevice[]) {
    this.ssoMobileDevices = mobileDevices;
  }

  public setSSOList(ssoList?: SSOModel[]) {
    this.ssoList = ssoList;
  }

  public setCurrentSSO(currentSSO: SSOModel) {
    this.currentSSO = currentSSO;
  }

  @action setDeviceConfiguration(value?: boolean) {
    this.isDeviceConfiguredBySSO = value;
  }

  @computed get SsoSeparatedUsersList() {
    const initial: Array<SSOUser[]> = [[], []];
    this.ssoUsersList?.forEach((current: SSOUser) => {
      const neededArray =
        current.userType === UserType.SSO ? initial[0] : initial[1];
      neededArray.push(current);
    }, []);

    return initial;
  }

  @action setSsoUsersList(list: SSOUser[]) {
    this.ssoUsersList = list;
  }

  public clear() {
    if (this.getIsDeviceConfiguredBySSO) {
      this.ssoUsersList = null;
      return;
    }

    this.currentSSO = undefined;
    this.ssoList = undefined;
    this.isDeviceConfiguredBySSO = false;
  }
}

export interface MobileDevice {
  partyRoleId: number;
  roleTypeId: number;
  roleTypeDescription: string;
  leanTecSerialNo: string;
  organizationName: string;
}

export interface SSOModel {
  pisaId: number;
  name: string;
  address?: string;
  pillarId?: string;
  msoPillarId?: string;
  distributorId?: string;
  distributorName?: string;
  isIntegrated?: boolean;
}

export interface SSOUser {
  b2CId: string;
  firstName: string;
  id: string;
  isPinRequired: boolean;
  isPinSet: boolean;
  lastName: string;
  role: RoleType;
  userType: UserType;
}
