import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import { getNavigationOptions } from './helpers';
import { authStore } from '../stores';
import { AppNavigator, AppStackParamList } from './types';
import { HomeStack } from './HomeStack';
import { UnauthStack } from './UnauthStack';

const Stack = createStackNavigator<AppStackParamList>();

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
          name={AppNavigator.UnauthStack}
          component={UnauthStack}
          options={getNavigationOptions}
        />
      )}
    </Stack.Navigator>
  );
});
