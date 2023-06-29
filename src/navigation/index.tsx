import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import { getNavigationOptions } from './helpers';
import { authStore } from '../stores';
import { LoginScreen } from '../modules/login/components/LoginScreen';
import { AppNavigator } from './types';
import { HomeStack } from './HomeStack';

const Stack = createStackNavigator();

export const AppStack = observer(() => {
  return (
    <Stack.Navigator>
      {authStore.isLoggedIn ? (
        <Stack.Screen
          name={AppNavigator.HomeStack}
          component={HomeStack}
          options={getNavigationOptions}
        />
      ) : (
        <Stack.Screen
          name={AppNavigator.LoginScreen}
          component={LoginScreen}
          options={getNavigationOptions}
        />
      )}
    </Stack.Navigator>
  );
});
