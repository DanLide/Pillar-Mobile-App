import { observable } from 'mobx';

import {
  getDeviceName,
  getVersion,
  getBundleId,
} from 'react-native-device-info';

const internalBundleId = 'com.globallogic.3m.repairstack.dev';

export class DeviceInfoStore {
  @observable deviceName: string;
  @observable version: string;

  constructor() {
    this.deviceName = '';
    this.version = getVersion();
    getDeviceName().then(deviceName => {
      const isInternalBuild = getBundleId() === internalBundleId;
      this.deviceName = isInternalBuild ? 'FH937GM6VF' : deviceName;
    });
  }
}
