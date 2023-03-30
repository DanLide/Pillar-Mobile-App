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
import { authStore } from "../stores";

import { LoginScreen } from "../modules/login/components/LoginScreen";
import { HomeScreen } from "../modules/home/HomeScreen";
import { LanguageSelectScreen } from "../modules/languageSelect/LanguageSelectScreen";

export enum AppNavigator {
  LoginScreen = 'LoginScreen',

  // HomeStack
  HomeStack = "HomeStack",
  HomeScreen = 'HomeScreen',
  TermsScreen = 'TermsScreen',
  LanguageSelectScreen = "LanguageSelectScreen",
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

const HomeStack = () => {
  const initialRoute = !authStore.isLanguageSelected ? AppNavigator.LanguageSelectScreen
    : !authStore.isTnCSelected ? AppNavigator.TermsAndConditionsScreen
    : AppNavigator.HomeScreen;

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={defaultOptions}
      />
      <Stack.Screen
        name={AppNavigator.TermsAndConditionsScreen}
        component={TermsAndConditionsScreen}
        options={defaultOptions}
      />
      <Stack.Screen
        name={AppNavigator.LanguageSelectScreen}
        component={LanguageSelectScreen}
        options={defaultOptions}
      />
    </Stack.Navigator>
  );
};

export const AppStack = observer(() => {
  return (
    <Stack.Navigator>
      {authStore.isLoggedIn ? (
        <Stack.Screen
          name={AppNavigator.HomeStack}
          component={HomeStack}
          options={defaultOptions}
        />
      ) : (
        <Stack.Screen
          name={AppNavigator.LoginScreen}
          component={LoginScreen}
          options={defaultOptions}
        />
      )}
    </Stack.Navigator>
  );
});

const styles = StyleSheet.create({
  logoutButton: { marginRight: 16 },
});
