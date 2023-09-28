import {
  observable,
  runInAction,
  action,
  makeAutoObservable,
} from 'mobx';

import { AppState } from 'react-native';

import {
  check,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  request,
  openSettings,
  Permission,
} from 'react-native-permissions';

class PermissionStore {
  @observable bluetoothPermission: PermissionStatus;
  constructor() {
    makeAutoObservable(this);
    this.bluetoothPermission = RESULTS.UNAVAILABLE;
    this.bluetoothCheck();

    AppState.addEventListener('change', state => {
      state === 'active' && this.bluetoothCheck();
    });
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

  @action bluetoothCheck() {
    check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then(result => {
      runInAction(() => {
        this.bluetoothPermission = result;
      });
    });
  }
}

export default new PermissionStore();
