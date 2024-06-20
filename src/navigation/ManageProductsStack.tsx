import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  AppNavigator,
  LeftBarType,
  ManageProductsStackParamList,
} from './types';
import { getScreenOptions } from './helpers';
import { SelectStockScreen } from '../modules/manageProducts/SelectStockScreen';
import { ManageProductsScreen } from '../modules/manageProducts/ManageProductsScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import {
  BluetoothPermissionScreen,
  CameraPermissionScreen,
} from '../modules/permissions';
import ScannerScreen from '../modules/manageProducts/ScannerScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import { getScreenName } from './helpers/getScreenName';
import permissionStore from '../modules/permissions/stores/PermissionStore';
import { DEFAULT_STACK_OPTIONS } from './navigation.const';
import { ScannerHeaderRightButtons } from './components/ScannerHeaderRightButtons';

const Stack = createStackNavigator<ManageProductsStackParamList>();

export const ManageProductsStack: React.FC = observer(() => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={DEFAULT_STACK_OPTIONS}
      initialRouteName={getScreenName(permissionStore)}
    >
      <Stack.Screen
        name={AppNavigator.BluetoothPermissionScreen}
        component={BluetoothPermissionScreen}
        options={getScreenOptions({
          title: t('bluetoothConnection'),
          leftBarButtonType: LeftBarType.Back,
        })}
        initialParams={{ nextRoute: AppNavigator.SelectStockScreen }}
      />
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: t('manageProducts'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ManageProductsScreen}
        component={ManageProductsScreen}
        options={getScreenOptions({
          title: t('manageProducts'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.BaseUnlockScreen}
        component={BaseUnlockScreen}
        options={({ route }) =>
          getScreenOptions({
            title: route.params?.title || '',
            leftBarButtonType: LeftBarType.Back,
            style: {
              shadowColor: 'transparent',
            },
          })
        }
        initialParams={{ nextScreen: AppNavigator.ScannerScreen }}
      />
      <Stack.Screen
        name={AppNavigator.HowToScanScreen}
        component={HowToScanScreen}
        options={getScreenOptions({
          title: t('howToScan'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CameraPermissionScreen}
        component={CameraPermissionScreen}
        options={getScreenOptions({
          title: t('cameraAccess'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={{
          title: t('manageProducts'),
          headerRight: () => <ScannerHeaderRightButtons />,
        }}
      />
    </Stack.Navigator>
  );
});
