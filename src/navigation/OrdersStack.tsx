import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { getScreenOptions } from './helpers';
import {
  AppNavigator,
  LeftBarType,
  OrdersParamsList,
  RightBarType,
} from './types';

import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { OrderDetailsScreen } from '../modules/orders/OrderDetailsScreen';
import { OrderByStockLocationScreen } from '../modules/orders/OrderByStockLocationScreen';
import { SelectStockScreen } from '../modules/orders/SelectStockScreen';
import CreateOrderScreen from '../modules/orders/CreateOrderScreen';
import { ResultScreen } from '../modules/orders/ResultScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import {
  BluetoothPermissionScreen,
  CameraPermissionScreen,
} from '../modules/permissions';
import { ScannerScreen } from '../modules/orders/ScannerScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';

const Stack = createStackNavigator<OrdersParamsList>();

export const OrdersStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.OrdersScreen}>
      <Stack.Screen
        name={AppNavigator.OrdersScreen}
        component={OrdersScreen}
        options={getScreenOptions({
          title: 'Manage Orders',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.OrderDetailsScreen}
        component={OrderDetailsScreen}
        options={getScreenOptions({
          title: 'View Order',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
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
        name={AppNavigator.OrderByStockLocationScreen}
        component={OrderByStockLocationScreen}
        options={getScreenOptions({
          title: '',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Create Order',
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
        initialParams={{ nextScreen: AppNavigator.CreateOrderScreen }}
      />
      <Stack.Screen
        name={AppNavigator.CreateOrderScreen}
        component={CreateOrderScreen}
        options={getScreenOptions({
          title: 'Create Order',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: 'Result screen',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: 'Create Order',
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
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
    </Stack.Navigator>
  );
};
