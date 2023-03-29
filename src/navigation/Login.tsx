import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../modules/login/components/LoginScreen';
import TermsScreen from '../modules/login/components/TermsScreen';
import { LoginRoutes } from './routes';

const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={LoginRoutes.TermsScreen} component={TermsScreen} />
      <Stack.Screen name={LoginRoutes.LoginScreen} component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default LoginStack;
