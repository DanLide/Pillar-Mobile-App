import React, { useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";

import { authStore } from "../stores";

import LoginStack from "./Login";
import HomeStack from "./Home";

const Stack = createStackNavigator();

export const AppStack = observer(() => {
  return (
    <Stack.Navigator>
      {authStore.isLoggedIn ? (
        <Stack.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="LoginStack"
          component={LoginStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
});
