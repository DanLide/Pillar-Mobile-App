import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginStack from './Login';
import { LoginRoutes } from './routes';

const Stack = createStackNavigator();

type ScreenOptions = React.ComponentProps<
  typeof Stack.Navigator
>['screenOptions'];

const loginStackOptions: ScreenOptions = {
  headerShown: false,
};

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={LoginRoutes.LoginStack}
        component={LoginStack}
        options={loginStackOptions}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
