import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";

import { defaultOptions, logout } from "./helpers";
import { authStore } from "../stores";

import { LoginScreen } from "../modules/login/components/LoginScreen";
import { HomeScreen } from "../modules/home/HomeScreen";
import TermsScreen from "../modules/terms/TermsScreen";
import { LanguageSelectScreen } from "../modules/languageSelect/LanguageSelectScreen";

export enum AppNavigator {
  LoginScreen = "LoginScreen",

  // HomeStack
  HomeStack = "HomeStack",
  HomeScreen = "HomeScreen",
  TermsScreen = "TermsScreen",
  LanguageSelectScreen = "LanguageSelectScreen",
}

const Stack = createStackNavigator();

type ScreenOptions = React.ComponentProps<
  typeof Stack.Navigator
>["screenOptions"];

const termsScreenOptions: ScreenOptions = {
  title: "Terms & Conditions",
  headerRight: () => (
    <View style={styles.logoutButton}>
      <Button title="Logout" onPress={logout} />
    </View>
  ),
};

const HomeStack = () => {
  const initialRoute = !authStore.isLanguageSelected
    ? AppNavigator.LanguageSelectScreen
    : !authStore.isTnCSelected
    ? AppNavigator.TermsScreen
    : AppNavigator.HomeScreen;

  return (
    <Stack.Navigator initialRouteName={AppNavigator.TermsScreen}>
      <Stack.Screen
        name={AppNavigator.HomeScreen}
        component={HomeScreen}
        options={defaultOptions}
      />
      <Stack.Screen
        name={AppNavigator.TermsScreen}
        component={TermsScreen}
        options={termsScreenOptions}
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
  logoutButton: { marginRight: 8 },
});
