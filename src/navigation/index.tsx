import React, { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import { defaultOptions, logout } from './helpers';
import { authStore } from '../stores';

import { IconButton } from '../components';
import { LoginScreen } from '../modules/login/components/LoginScreen';
import { HomeScreen } from '../modules/home/HomeScreen';
import TermsScreen from '../modules/terms/TermsScreen';

enum AppNavigator {
  HomeScreen = 'HomeScreen',
  LoginScreen = 'LoginScreen',
  TermsScreen = 'TermsScreen',
}

const Stack = createStackNavigator();

type ScreenOptions = React.ComponentProps<
  typeof Stack.Navigator
>['screenOptions'];

const termsScreenOptions: ScreenOptions = {
  title: 'Terms & Conditions',
  headerRight: () => (
    <IconButton
      name="logout"
      size={20}
      style={styles.logoutButton}
      onPress={logout}
    />
  ),
};

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

    if (store.isTnC) {
      return (
        <Stack.Screen
          name={AppNavigator.TermsScreen}
          component={TermsScreen}
          options={termsScreenOptions}
        />
      );
    }

    return (
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={defaultOptions}
      />
    );
  }, [store.isLoggedIn, store.isTnC]);

  return <Stack.Navigator>{currentScreen}</Stack.Navigator>;
});

const styles = StyleSheet.create({
  logoutButton: { marginRight: 16 },
});
