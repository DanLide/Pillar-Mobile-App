import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginStack from './Login'

const Stack = createStackNavigator()

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AppStack

