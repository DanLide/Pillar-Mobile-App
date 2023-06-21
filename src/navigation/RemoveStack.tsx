import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AppNavigator, LeftBarType, RemoveStackParamList } from './types';
import { SelectStockScreen } from '../modules/removeProducts/SelectStockScreen';
import { getScreenOptions } from './helpers';
import RemoveProductsScreen from '../modules/removeProducts/RemoveProductsScreen';
import RemoveProductScannerScreen from '../modules/removeProducts/ScannerScreen';
import { ResultScreen } from '../modules/removeProducts/ResultScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { CameraPermissionScreen } from '../modules/cameraPermission';

const Stack = createStackNavigator<RemoveStackParamList>();

export const RemoveStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Remove Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.RemoveProductsScreen}
        component={RemoveProductsScreen}
        options={getScreenOptions({
          title: 'Remove Products',
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
        name={AppNavigator.RemoveProductScannerScreen}
        component={RemoveProductScannerScreen}
        options={getScreenOptions({
          title: 'Remove Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: 'Remove Products',
          leftBarButtonType: LeftBarType.Close,
        })}
      />
    </Stack.Navigator>
  );
};
