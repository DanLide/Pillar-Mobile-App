import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import {
  AppNavigator,
  LeftBarType,
  ManageProductsStackParamList,
  RightBarType,
} from './types';
import { getScreenOptions } from './helpers';
import { SelectStockScreen } from '../modules/manageProducts/SelectStockScreen';
import { ManageProductsScreen } from '../modules/manageProducts/ManageProductsScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { BluetoothPermissionScreen, CameraPermissionScreen } from '../modules/permissions';
import ScannerScreen from '../modules/manageProducts/ScannerScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import { getScreenName } from './helpers/getScreenName';
import permissionStore from '../modules/permissions/stores/PermissionStore';

const Stack = createStackNavigator<ManageProductsStackParamList>();

export const ManageProductsStack: React.FC = observer(() => {
  return (
    <Stack.Navigator initialRouteName={getScreenName(permissionStore)}>
       <Stack.Screen
        name={AppNavigator.BluetoothPermissionScreen}
        component={BluetoothPermissionScreen}
        options={getScreenOptions({
          title: 'Bluetooth Connection',
          leftBarButtonType: LeftBarType.Back,
        })}
        initialParams={{ nextRoute: AppNavigator.SelectStockScreen }}
      />
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Manage Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ManageProductsScreen}
        component={ManageProductsScreen}
        options={getScreenOptions({
          title: 'Manage Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
       <Stack.Screen
        name={AppNavigator.BaseUnlockScreen}
        component={BaseUnlockScreen}
        options={({ route }) => getScreenOptions({
          title: route.params?.title || '',
          leftBarButtonType: LeftBarType.Back,
          style: {
            shadowColor: 'transparent',
          }
        })}
        initialParams={{ nextScreen: AppNavigator.ManageProductsScreen }}
      />
      <Stack.Screen
        name={AppNavigator.HowToScanScreen}
        component={HowToScanScreen}
        options={getScreenOptions({
          title: 'How to Scan',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CameraPermissionScreen}
        component={CameraPermissionScreen}
        options={getScreenOptions({
          title: 'Camera Access',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: 'Manage Products',
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark
        })}
      />
    </Stack.Navigator>
  );
});

