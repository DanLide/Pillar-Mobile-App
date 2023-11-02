import {
  observable,
  runInAction,
  action,
  makeAutoObservable,
  computed,
} from 'mobx';

import { AppState, Linking } from 'react-native';

import {
  check,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  request,
  openSettings,
  Permission,
} from 'react-native-permissions';
// eslint-disable-next-line import/default
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

class PermissionStore {
  @observable bluetoothPermission: PermissionStatus;
  @observable bluetoothStatus: BluetoothStateManager.BluetoothState;

  constructor() {
    makeAutoObservable(this);
    this.bluetoothPermission = RESULTS.UNAVAILABLE;
    this.bluetoothStatus = 'Unknown';
    this.bluetoothCheck();

    AppState.addEventListener('change', state => {
      state === 'active' && this.bluetoothCheck();
    });
    BluetoothStateManager.onStateChange(state => {
      runInAction(() => {
        this.bluetoothStatus = state;
      });
    }, true);
  }

  @action async requestPermission(type: Permission) {
    const status = await request(type);
    runInAction(() => {
      this.bluetoothPermission = status;
    });
    return status;
  }

  @action openSetting() {
    openSettings();
  }

  @action openBluetoothPowerSetting() {
    Linking.openSettings();
  }

  @action bluetoothCheck() {
    check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then(result => {
      runInAction(() => {
        this.bluetoothPermission = result;
      });
    });
  }

  @computed get isBluetoothOn() {
    return this.bluetoothStatus === 'PoweredOn';
  }
}

export default new PermissionStore();
