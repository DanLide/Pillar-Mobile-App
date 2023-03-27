import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../modules/home/HomeScreen";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
