import { RESULTS } from 'react-native-permissions';
import { AppNavigator } from '../types';
import permissionStore from '../../modules/permissions/stores/PermissionStore';
import { ssoStore } from 'src/stores';

export const getScreenName = (_permissionStore: typeof permissionStore) => {
  return _permissionStore.bluetoothPermission === RESULTS.GRANTED ||
    !ssoStore.getIsDeviceConfiguredBySSO
    ? AppNavigator.SelectStockScreen
    : AppNavigator.BluetoothPermissionScreen;
};
