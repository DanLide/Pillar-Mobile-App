import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SelectStockScreen } from '../modules/returnProducts/SelectStockScreen';
import { getScreenOptions, LeftBarType } from './helpers';
import { AppNavigator } from './index';

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
};

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
