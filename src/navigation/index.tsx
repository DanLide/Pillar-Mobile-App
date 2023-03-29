import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";

import { defaultOptions } from "./helpers";

import { authStore } from "../stores";

import { LoginScreen } from "../modules/login/components/LoginScreen";
import { HomeScreen } from "../modules/home/HomeScreen";

enum AppNavigator {
  HomeScreen = "HomeScreen",
  LoginScreen = "LoginScreen",
}

const Stack = createStackNavigator();

export const AppStack = observer(() => {
  return (
    <Stack.Navigator>
      {authStore.isLoggedIn ? (
        <Stack.Screen
          name={AppNavigator.HomeScreen}
          component={HomeScreen}
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
