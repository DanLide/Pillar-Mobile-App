import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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
import { CameraPermissionScreen } from '../modules/cameraPermission';
import ScannerScreen from '../modules/manageProducts/ScannerScreen';

const Stack = createStackNavigator<ManageProductsStackParamList>();

export const ManageProductsStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
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
};
