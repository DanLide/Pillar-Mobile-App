import { action, computed, makeObservable, observable } from 'mobx';

import {
  getDeviceNameSync,
  getVersion,
  getBundleId,
} from 'react-native-device-info';

const internalBundleId = 'com.globallogic.3m.repairstack.dev';
const isInternalBuild = getBundleId() === internalBundleId;
const deviceName = getDeviceNameSync();

const get3MDeviceName = (deviceId: string) => deviceId.split('-')[2];

export class DeviceInfoStore {
  @observable deviceName: string;
  @observable version: string;

  constructor() {
    this.deviceName = isInternalBuild
      ? 'FH937GM6VF'
      : get3MDeviceName(deviceName);
    this.version = getVersion();
    makeObservable(this);
  }

  @computed get getDeviceName() {
    return this.deviceName;
  }

  @action setDeviceName(deviceName: string) {
    this.deviceName = deviceName;
  }
}
