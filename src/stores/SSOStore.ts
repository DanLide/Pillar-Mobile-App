export class SSOStore {
  private currentSSO?: SSOModel;
  private ssoList?: SSOModel[];
  private ssoMobileDevices?: MobileDevice[];
  private isDeviceConfiguredBySSO?: boolean;

  constructor() {
    this.currentSSO = undefined;
    this.ssoList = undefined;
    this.ssoMobileDevices = undefined;
    this.isDeviceConfiguredBySSO = undefined;
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

  public setDeviceConfiguration(value?: boolean) {
    this.isDeviceConfiguredBySSO = value;
  }

  public clear() {
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
}
