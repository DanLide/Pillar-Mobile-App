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
  @observable locationPermission: PermissionStatus;

  constructor() {
    makeAutoObservable(this);
    this.bluetoothPermission = RESULTS.UNAVAILABLE;
    this.locationPermission = RESULTS.UNAVAILABLE;
    this.bluetoothStatus = 'Unknown';
    this.bluetoothCheck();
    this.locationCheck();

    AppState.addEventListener('change', state => {
      if (state === 'active') {
        this.bluetoothCheck();
        this.locationCheck();
      }
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
      switch (type) {
        case PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL:
          this.bluetoothPermission = status;
          break;
        case PERMISSIONS.IOS.LOCATION_WHEN_IN_USE: {
          this.locationPermission = status;
          break;
        }
      }
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

  @action locationCheck() {
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
      runInAction(() => {
        this.locationPermission = result;
      });
    });
  }

  @computed get isBluetoothOn() {
    return this.bluetoothStatus === 'PoweredOn';
  }
}

export default new PermissionStore();
