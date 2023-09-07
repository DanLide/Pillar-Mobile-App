import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, OrdersParamsList } from './types';

import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { OrderDetailsScreen } from '../modules/orders/OrderDetailsScreen';
import { OrderByStockLocationScreen } from '../modules/orders/OrderByStockLocationScreen';

const Stack = createStackNavigator<OrdersParamsList>();

export const OrdersStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.OrdersScreen}>
      <Stack.Screen
        name={AppNavigator.OrdersScreen}
        component={OrdersScreen}
        options={getScreenOptions({
          title: 'Manage Orders',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.OrderDetailsScreen}
        component={OrderDetailsScreen}
        options={getScreenOptions({
          title: 'View Order',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.OrderByStockLocationScreen}
        component={OrderByStockLocationScreen}
        options={getScreenOptions({
          title: '',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
