import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  AppNavigator,
  LeftBarType,
  ManageProductsStackParamList,
} from './types';
import { getScreenOptions } from './helpers';
import { SelectStockScreen } from '../modules/manageProducts/SelectStockScreen';
import { ManageProductsScreen } from '../modules/manageProducts/ManageProductsScreen';

const Stack = createStackNavigator<ManageProductsStackParamList>();

export const ManageProductsStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectStockScreen}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Manage Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ManageProductsScreen}
        component={ManageProductsScreen}
        options={getScreenOptions({
          title: 'Manage Products',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
