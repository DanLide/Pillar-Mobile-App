import { action, computed, makeObservable, observable } from 'mobx';
import { NativeModules } from 'react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';

export class DeviceInfoStore {
  @observable deviceName: string;
  @observable partyRoleId?: number;
  @observable version: string;

  constructor() {
    this.deviceName = '';
    NativeModules.JAMFAppConfigModule.getDeviceName((deviceName: string) => {
      if (deviceName.split('-')[2]?.length >= 9) {
        this.deviceName = deviceName.split('-')[2];
      } else {
        this.deviceName = deviceName.split('-')[3] ?? deviceName;
      }
    });
    this.version = `${getVersion()} - ${getBuildNumber()}`;
    makeObservable(this);
  }

  @computed get getDeviceName() {
    return this.deviceName;
  }

  @action setDeviceName(deviceName: string) {
    this.deviceName = deviceName;
  }

  @action setPartyRoleId(partyRoleId: number) {
    this.partyRoleId = partyRoleId;
  }
}
