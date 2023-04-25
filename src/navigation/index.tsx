import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import {
  getNavigationOptions,
  getScreenOptions,
  logout,
  LeftHeaderType,
} from './helpers';
import { authStore, ssoStore } from '../stores';
import { AuthStore } from '../stores/AuthStore';
import { SSOStore } from '../stores/SSOStore';
import { LoginScreen } from '../modules/login/components/LoginScreen';
import { HomeScreen } from '../modules/home/HomeScreen';
import TermsScreen from '../modules/terms/TermsScreen';
import { LanguageSelectScreen } from '../modules/languageSelect/LanguageSelectScreen';
import SelectSSOScreen from '../modules/sso/SelectSSOScreen';

import { SelectStockScreen } from '../modules/removeProducts/SelectStockScreen';
import { RemoveProductsScreen } from '../modules/removeProducts/RemoveProductsScreen';
import { removeProductsStore } from '../modules/removeProducts/stores';

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
}

const Stack = createStackNavigator();

type ScreenOptions = React.ComponentProps<
  typeof Stack.Navigator
>['screenOptions'];

const termsScreenOptions: ScreenOptions = {
  title: 'Terms & Conditions',
  headerRight: () => (
    <View style={styles.logoutButton}>
      <Button title="Logout" onPress={logout} />
    </View>
  ),
};

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

const removeProductsScreenOptions: ScreenOptions = {
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
          leftHeaderType: LeftHeaderType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.RemoveProductsScreen}
        component={RemoveProductsScreen}
        options={removeProductsScreenOptions}
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
        options={termsScreenOptions}
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
        options={getNavigationOptions}
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

const styles = StyleSheet.create({
  logoutButton: { marginRight: 8 },
});
