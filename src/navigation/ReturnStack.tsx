import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SelectStockScreen } from '../modules/returnProducts/SelectStockScreen';
import { getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, ReturnStackParamList } from './types';
import { ReturnProductsScreen } from '../modules/returnProducts/ReturnProductsScreen';
import { ScannerScreen } from '../modules/returnProducts/ScannerScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { CameraPermissionScreen } from '../modules/cameraPermission';

const Stack = createStackNavigator<ReturnStackParamList>();

export const ReturnStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Return Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ReturnProductsScreen}
        component={ReturnProductsScreen}
        options={getScreenOptions({
          title: 'Return Products',
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
          title: 'Return Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
