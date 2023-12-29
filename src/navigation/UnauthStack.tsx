import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { getNavigationOptions, getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, UnauthStackParamsList } from './types';
import { WelcomeScreen } from '../modules/login/WelcomeScreen';
import { LoginViaCredentialsScreen } from '../modules/login/LoginViaCredentialsScreen';
import { LoginViaPinScreen } from 'src/modules/login/LoginViaPinScreen';
import { UpdateShopLocationScreen } from 'src/modules/login/UpdateShopLocationScreen';
import { CreatePinScreen } from 'src/modules/login/CreatePinScreen';
import { ssoStore } from 'src/stores';
import { LoginWithPinScreen } from "src/modules/login/LoginWithPinScreen";

const Stack = createStackNavigator<UnauthStackParamsList>();

export const UnauthStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.WelcomeScreen}>
      <Stack.Screen
        name={AppNavigator.WelcomeScreen}
        component={WelcomeScreen}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.LoginViaCredentialsScreen}
        component={LoginViaCredentialsScreen}
        options={getScreenOptions({
          title: 'RepairStack',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.LoginViaPinScreen}
        component={LoginViaPinScreen}
        options={getScreenOptions({
          title: ssoStore.getCurrentSSO?.address || 'Repair Stack',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.UpdateShopLocationScreen}
        component={UpdateShopLocationScreen}
        options={getScreenOptions({
          title: 'Update Location',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CreatePinScreen}
        component={CreatePinScreen}
        options={getScreenOptions({
          title: ssoStore.getCurrentSSO?.address || 'Repair Stack',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.LoginWithPinScreen}
        component={LoginWithPinScreen}
        options={getScreenOptions({
          title: ssoStore.getCurrentSSO?.address || 'Repair Stack',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
