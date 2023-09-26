import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { getScreenOptions } from './helpers';
import { 
  AppNavigator,
  LeftBarType,
  CreateInvoiceParamList,
  RightBarType,
} from './types';

import { SelectJob } from '../modules/createInvoice/SelectJob';
import { ScannerScreen } from '../modules/createInvoice/ScannerScreen';
import { ResultScreen } from '../modules/createInvoice/ResultScreen';
import { ProductsScreen } from '../modules/createInvoice/ProductsScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { CameraPermissionScreen } from '../modules/permissions';

const Stack = createStackNavigator<CreateInvoiceParamList>();

export const CreateInvoiceStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectProductJob}>
      <Stack.Screen
        name={AppNavigator.SelectProductJob}
        component={SelectJob}
        options={getScreenOptions({
          title: 'Create Invoice',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: 'Create Invoice',
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: 'Create Invoice',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CreateInvoiceProductsScreen}
        component={ProductsScreen}
        options={getScreenOptions({
          title: 'Create Invoice',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.HowToScanScreen}
        component={HowToScanScreen}
        options={getScreenOptions({
          title: 'How to Scan',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CameraPermissionScreen}
        component={CameraPermissionScreen}
        options={getScreenOptions({
          title: 'Camera Access',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
