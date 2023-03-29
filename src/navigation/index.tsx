import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";

import { defaultOptions } from "./helpers";

import { authStore } from "../stores";

import { LoginScreen } from "../modules/login/components/LoginScreen";
import { HomeScreen } from "../modules/home/HomeScreen";
import { TermsAndConditionsScreen } from "../modules/termsAndConditions/TermsAndConditionsScreen";
import { LanguageSelectScreen } from "../modules/languageSelect/LanguageSelectScreen";

export enum AppNavigator {
  LoginScreen = "LoginScreen",

  // HomeStack
  HomeStack = "HomeStack",
  HomeScreen = "HomeScreen",
  TermsAndConditionsScreen = "TermsAndConditionsScreen",
  LanguageSelectScreen = "LanguageSelectScreen",
}

const Stack = createStackNavigator();

const Home = () => {
  const initialRoute = !authStore.isLanguageSelected
    ? AppNavigator.LanguageSelectScreen
    : !authStore.isTnCSelected
    ? AppNavigator.TermsAndConditionsScreen
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
          component={Home}
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
