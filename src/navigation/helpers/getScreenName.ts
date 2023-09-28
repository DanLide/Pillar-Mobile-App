import {RESULTS} from 'react-native-permissions';
import { AppNavigator } from '../types';
import permissionStore from '../../modules/permissions/stores/PermissionStore';

export const getScreenName = (_permissionStore: typeof permissionStore) => {
  return _permissionStore.bluetoothPermission === RESULTS.GRANTED ? AppNavigator.SelectStockScreen : AppNavigator.BluetoothPermissionScreen
};