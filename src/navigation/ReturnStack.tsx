import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SelectStockScreen } from '../modules/returnProducts/SelectStockScreen';
import { getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, ReturnStackParamList } from "./types";

const Stack = createStackNavigator<ReturnStackParamList>();

const ReturnStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Return Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};

export default ReturnStack;
