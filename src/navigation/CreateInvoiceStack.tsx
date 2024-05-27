import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName={AppNavigator.SelectProductJob}>
      <Stack.Screen
        name={AppNavigator.SelectProductJob}
        component={SelectJob}
        options={getScreenOptions({
          title: t('createInvoice'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: t('createInvoice'),
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: t('createInvoice'),
          leftBarButtonType: LeftBarType.Close,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CreateInvoiceProductsScreen}
        component={ProductsScreen}
        options={getScreenOptions({
          title: t('createInvoice'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.HowToScanScreen}
        component={HowToScanScreen}
        options={getScreenOptions({
          title: t('howToScan'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CameraPermissionScreen}
        component={CameraPermissionScreen}
        options={getScreenOptions({
          title: t('cameraAccess'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
