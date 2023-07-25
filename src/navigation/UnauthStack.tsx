import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { getNavigationOptions, getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, UnauthStackParamsList } from './types';
import { WelcomeScreen } from '../modules/login/WelcomeScreen';
import { LoginScreen } from '../modules/login/components/LoginScreen';

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
        name={AppNavigator.LoginScreen}
        component={LoginScreen}
        options={getScreenOptions({
          title: 'Login',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
