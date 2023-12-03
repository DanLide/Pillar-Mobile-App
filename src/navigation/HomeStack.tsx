import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { isNil } from 'ramda';

import { HomeScreen } from '../modules/home/HomeScreen';
import { LanguageSelectScreen } from '../modules/languageSelect/LanguageSelectScreen';
import { SelectSSOScreen } from '../modules/sso/SelectSSOScreen';
import TermsScreen from '../modules/terms/TermsScreen';
import { authStore, ssoStore } from '../stores';
import { AuthStore } from '../stores/AuthStore';
import { SSOStore } from '../stores/SSOStore';
import { ConfigureDeviceStack } from './ConfigureDeviceStack';
import { CreateInvoiceStack } from './CreateInvoiceStack';
import { ManageProductsStack } from './ManageProductsStack';
import { OrdersStack } from './OrdersStack';
import { RemoveStack } from './RemoveStack';
import { ReturnStack } from './ReturnStack';
import { DrawerContent } from './components';
import { getNavigationOptions, getScreenOptions } from './helpers';
import {
  AppNavigator,
  HomeStackParamList,
  LeftBarType,
  RightBarType,
} from './types';
import { SettingsScreen } from 'src/modules/settings/SettingsScreen';
import { AlphaAlertScreen } from 'src/modules/terms/AlphaAlertScreen';
import { useNavigation } from '@react-navigation/native';

const getInitialScreen = (
  authStore: AuthStore,
  ssoStore: SSOStore,
): keyof HomeStackParamList => {
  const getIsDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;
  if (!authStore.isUsernameExistInUsernames) {
    return AppNavigator.AlphaAlertScreen;
  }
  // if (!authStore.isLanguageSelected) {
  //   return AppNavigator.LanguageSelectScreen;
  // }
  if (!isNil(getIsDeviceConfiguredBySSO) && !getIsDeviceConfiguredBySSO) {
    return AppNavigator.ConfigureDeviceStack;
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
  leftBarButtonType: LeftBarType.Drawer,
});

const Drawer = createDrawerNavigator();

const DrawerHome = () => (
  <Drawer.Navigator
    useLegacyImplementation
    drawerContent={props => <DrawerContent {...props} />}
  >
    <Drawer.Screen
      name={AppNavigator.HomeScreen}
      component={HomeScreen}
      options={homeScreenOptions}
    />
  </Drawer.Navigator>
);

export const HomeStack: React.FC = () => {
  const navigation = useNavigation<any>();
  const initialRoute = getInitialScreen(authStore, ssoStore);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name={AppNavigator.Drawer}
        component={DrawerHome}
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
        name={AppNavigator.AlphaAlertScreen}
        component={AlphaAlertScreen}
        options={getScreenOptions({
          title: 'Alpha/Beta Agreement',
          leftBarButtonType: LeftBarType.Close,
          leftBarButtonAction: () => {
            const screen = getInitialScreen(authStore, ssoStore);
            if (screen === AppNavigator.HomeScreen) {
              navigation.reset({
                routes: [{ name: AppNavigator.Drawer }],
              });
            } else {
              navigation.navigate(screen);
            }
          },
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
      <Stack.Screen
        name={AppNavigator.CreateInvoiceStack}
        component={CreateInvoiceStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.OrdersStack}
        component={OrdersStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.ConfigureDeviceStack}
        component={ConfigureDeviceStack}
        options={getNavigationOptions}
      />
      <Stack.Screen
        name={AppNavigator.Settings}
        component={SettingsScreen}
        options={getScreenOptions({
          title: 'Settings',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
