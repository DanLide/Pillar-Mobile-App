import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import { getNavigationOptions, getScreenOptions, LeftBarType } from './helpers';
import { authStore, ssoStore } from '../stores';
import { AuthStore } from '../stores/AuthStore';
import { SSOStore } from '../stores/SSOStore';
import { LoginScreen } from '../modules/login/components/LoginScreen';
import { HomeScreen } from '../modules/home/HomeScreen';
import TermsScreen from '../modules/terms/TermsScreen';
import { LanguageSelectScreen } from '../modules/languageSelect/LanguageSelectScreen';
import SelectSSOScreen from '../modules/sso/SelectSSOScreen';

import { SelectStockScreen } from '../modules/removeProducts/SelectStockScreen';
import { ResultScreen } from '../modules/removeProducts/ResultScreen';
import { RemoveProductsScreen } from '../modules/removeProducts/RemoveProductsScreen';
import { removeProductsStore } from '../modules/removeProducts/stores';
import { RightBarType } from './helpers/getScreenOptions';

export enum AppNavigator {
  LoginScreen = 'LoginScreen',

  // HomeStack
  HomeStack = 'HomeStack',
  HomeScreen = 'HomeScreen',
  TermsScreen = 'TermsScreen',
  LanguageSelectScreen = 'LanguageSelectScreen',
  SelectSSOScreen = 'SelectSSOScreen',

  // RemoveProductsStack
  RemoveProductsStack = 'RemoveProductsStack',
  SelectStockScreen = 'SelectStockScreen',
  RemoveProductsScreen = 'RemoveProductsScreen',
  ResultScreen = 'ResultScreen',
}

const Stack = createStackNavigator();

const RemoveProductsScreenHeader = () => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
      Remove Products
    </Text>
    <Text style={{ textAlign: 'center' }}>
      {removeProductsStore.currentStock?.organizationName}
    </Text>
  </View>
);

const removeProductsScreenOptions = {
  headerBackTitle: 'Back',
  headerTitle: RemoveProductsScreenHeader,
};

const RemoveStack = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Remove Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.RemoveProductsScreen}
        component={RemoveProductsScreen}
        options={removeProductsScreenOptions}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: 'Remove Products',
          leftBarButtonType: LeftBarType.Close,
        })}
      />
    </Stack.Navigator>
  );
};

const getInitialScreen = (
  authStore: AuthStore,
  ssoStore: SSOStore,
): AppNavigator | undefined => {
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

const ssoScreenOptions = getScreenOptions({
  title: 'Shop Location',
  rightBarButtonType: RightBarType.Logout,
});

const HomeStack = () => {
  const initialRoute = getInitialScreen(authStore, ssoStore);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={getNavigationOptions}
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
        name={AppNavigator.RemoveProductsStack}
        component={RemoveStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.SelectSSOScreen}
        component={SelectSSOScreen}
        options={ssoScreenOptions}
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