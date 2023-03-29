import React, { useMemo, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import { defaultOptions } from './helpers';
import { authStore } from '../stores';

import { LoginScreen } from '../modules/login/components/LoginScreen';
import { HomeScreen } from '../modules/home/HomeScreen';
import TermsScreen from '../modules/login/components/TermsScreen';

enum AppNavigator {
  HomeScreen = 'HomeScreen',
  LoginScreen = 'LoginScreen',
  TermsScreen = 'TermsScreen',
}

const Stack = createStackNavigator();

export const AppStack = observer(() => {
  const store = useRef(authStore).current;

  const currentScreen = useMemo(() => {
    if (!store.isLoggedIn) {
      return (
        <Stack.Screen
          name={AppNavigator.LoginScreen}
          component={LoginScreen}
          options={defaultOptions}
        />
      );
    }

    if (!store.getIsTnC) {
      return (
        <Stack.Screen name={AppNavigator.TermsScreen} component={TermsScreen} />
      );
    }

    return (
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={defaultOptions}
      />
    );
  }, [store.getIsTnC, store.isLoggedIn]);

  return <Stack.Navigator>{currentScreen}</Stack.Navigator>;
});
