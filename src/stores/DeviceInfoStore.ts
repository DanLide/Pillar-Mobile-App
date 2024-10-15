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
import { storageKeys } from 'src/constants';
import { RNKeychainStorage } from 'src/services';

export class DeviceInfoStore {
  @observable deviceName = '';
  @observable partyRoleId?: number;
  @observable version: string;
  @observable isSimulator?: boolean;

  constructor() {
    this.version = `${getVersion()} - ${getBuildNumber()}`;
    this.getInitialDeviceName();
    this.checkIsSimulator();
    makeObservable(this);
  }

  @computed get getDeviceName() {
    return this.deviceName;
  }

  @action setDeviceName(deviceName: string) {
    RNKeychainStorage.setRecord(storageKeys.DEVICE_NAME, deviceName);
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

  getInitialDeviceName() {
    NativeModules.JAMFAppConfigModule.getDeviceName(
      async (JAMFName: string) => {
        let deviceName = '';
        if (JAMFName.split('-')[2]?.length >= 9) {
          deviceName = JAMFName.split('-')[2];
        } else {
          deviceName = JAMFName.split('-')[3] ?? JAMFName;
        }
        if (deviceName === 'Default Device Name') {
          const persistedDeviceName = await RNKeychainStorage.getRecord(
            storageKeys.DEVICE_NAME,
          );
          deviceName = persistedDeviceName || deviceName;
        }
        runInAction(() => {
          this.deviceName = deviceName;
        });
      },
    );
  }
}
