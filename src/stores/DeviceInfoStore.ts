import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { NativeModules } from 'react-native';
import {
  getVersion,
  getBuildNumber,
  isEmulator,
} from 'react-native-device-info';

export class DeviceInfoStore {
  @observable deviceName: string;
  @observable partyRoleId?: number;
  @observable version: string;
  @observable isSimulator?: boolean;

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
    this.checkIsSimulator();
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

  async checkIsSimulator() {
    const isSimulator = await isEmulator();
    runInAction(() => {
      this.isSimulator = isSimulator;
    });
  }
}
