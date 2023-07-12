import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStore } from '../stores/AuthStore';
import { SSOStore } from '../stores/SSOStore';
import { AppNavigator, HomeStackParamList, RightBarType } from './types';
import { getNavigationOptions, getScreenOptions } from './helpers';
import { authStore, ssoStore } from '../stores';
import { HomeScreen } from '../modules/home/HomeScreen';
import TermsScreen from '../modules/terms/TermsScreen';
import { LanguageSelectScreen } from '../modules/languageSelect/LanguageSelectScreen';
import { SelectSSOScreen } from '../modules/sso/SelectSSOScreen';
import { ReturnStack } from './ReturnStack';
import { RemoveStack } from './RemoveStack';
import { ManageProductsStack } from './ManageProductsStack';

const getInitialScreen = (
  authStore: AuthStore,
  ssoStore: SSOStore,
): keyof HomeStackParamList => {
  if (!authStore.isLanguageSelected) {
    return AppNavigator.LanguageSelectScreen;
  }
  if (!authStore.isTnCSelected) {
    return AppNavigator.TermsScreen;
  }
  if (!ssoStore.getCurrentSSO) {
    return AppNavigator.SelectSSOScreen;
  }
  return AppNavigator.HomeScreen;
};

const Stack = createStackNavigator<HomeStackParamList>();

const ssoScreenOptions = getScreenOptions({
  title: 'Shop Location',
  rightBarButtonType: RightBarType.Logout,
});

const homeScreenOptions = getScreenOptions({
  title: 'Repair Stack',
  rightBarButtonType: RightBarType.Logout,
});

export const HomeStack: React.FC = () => {
  const initialRoute = getInitialScreen(authStore, ssoStore);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={homeScreenOptions}
      />
      <Stack.Screen
        name={AppNavigator.TermsScreen}
        component={TermsScreen}
        options={getScreenOptions({
          title: 'Terms & Conditions',
          rightBarButtonType: RightBarType.Logout,
        })}
      />
      <Stack.Screen
        name={AppNavigator.LanguageSelectScreen}
        component={LanguageSelectScreen}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.SelectSSOScreen}
        component={SelectSSOScreen}
        options={ssoScreenOptions}
      />
      <Stack.Screen
        name={AppNavigator.RemoveProductsStack}
        component={RemoveStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.ReturnProductsStack}
        component={ReturnStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.ManageProductsStack}
        component={ManageProductsStack}
        options={getNavigationOptions}
      />
    </Stack.Navigator>
  );
};
