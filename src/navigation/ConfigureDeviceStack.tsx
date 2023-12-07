import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { getScreenOptions } from './helpers';
import { AppNavigator, ConfigureDeviceStackParams, LeftBarType } from './types';

import { useNavigation } from '@react-navigation/native';
import { DeviceConfigCompletedScreen } from 'src/modules/configureDevice/DeviceConfigCompletedScreen';
import EnterShopCodeScreen from 'src/modules/configureDevice/EnterShopCodeScreen';
import { ScanShopCodeScreen } from 'src/modules/configureDevice/ScanShopCodeScreen';
import { SelectStockLocationsScreen } from 'src/modules/configureDevice/SelectStockLocationsScreen';
import { CameraPermissionScreen } from 'src/modules/permissions';
import { authStore, ssoStore } from 'src/stores';

const Stack = createStackNavigator<ConfigureDeviceStackParams>();

export const ConfigureDeviceStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName={AppNavigator.ScanShopCodeScreen}>
      <Stack.Screen
        name={AppNavigator.ScanShopCodeScreen}
        component={ScanShopCodeScreen}
        options={getScreenOptions({
          leftBarButtonAction: () => {
            authStore.logOut();
          },
          leftBarButtonType: LeftBarType.Back,
          title: 'Repair Facility code',
        })}
      />
      <Stack.Screen
        name={AppNavigator.EnterShopCodeScreen}
        component={EnterShopCodeScreen}
        options={getScreenOptions({
          leftBarButtonType: LeftBarType.Back,
          title: 'Repair Facility code',
        })}
      />
      <Stack.Screen
        name={AppNavigator.SelectStockLocationsScreen}
        component={SelectStockLocationsScreen}
        options={getScreenOptions({
          leftBarButtonAction: () => {
            ssoStore.clear();
            navigation.goBack();
          },
          leftBarButtonType: LeftBarType.Back,
          title: 'Configure Shop Device',
        })}
      />
      <Stack.Screen
        name={AppNavigator.DeviceConfigCompletedScreen}
        component={DeviceConfigCompletedScreen}
        options={getScreenOptions({
          leftBarButtonType: LeftBarType.Back,
          title: 'Configure Shop Device',
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
