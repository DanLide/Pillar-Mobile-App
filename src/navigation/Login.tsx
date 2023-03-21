import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../modules/login/components/LoginScreen'

const Stack = createStackNavigator()

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default LoginStack