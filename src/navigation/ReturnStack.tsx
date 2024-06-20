import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { SelectStockScreen } from '../modules/returnProducts/SelectStockScreen';
import { getScreenOptions } from './helpers';
import {
  AppNavigator,
  LeftBarType,
  ReturnStackParamList,
  RightBarType,
} from './types';
import { ReturnProductsScreen } from '../modules/returnProducts/ReturnProductsScreen';
import { ScannerScreen } from '../modules/returnProducts/ScannerScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import {
  BluetoothPermissionScreen,
  CameraPermissionScreen,
} from '../modules/permissions';
import { ResultScreen } from '../modules/returnProducts/ResultScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import permissionStore from '../modules/permissions/stores/PermissionStore';
import { getScreenName } from './helpers/getScreenName';

const Stack = createStackNavigator<ReturnStackParamList>();

export const ReturnStack: React.FC = observer(() => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName={getScreenName(permissionStore)}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: t('returnProducts'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.BaseUnlockScreen}
        component={BaseUnlockScreen}
        options={({ route }) =>
          getScreenOptions({
            title: route.params?.title || '',
            leftBarButtonType: LeftBarType.Back,
            style: {
              shadowColor: 'transparent',
            },
          })
        }
        initialParams={{ nextScreen: AppNavigator.ScannerScreen }}
      />
      <Stack.Screen
        name={AppNavigator.BluetoothPermissionScreen}
        component={BluetoothPermissionScreen}
        options={getScreenOptions({
          title: t('bluetoothConnection'),
          leftBarButtonType: LeftBarType.Back,
        })}
        initialParams={{ nextRoute: AppNavigator.SelectStockScreen }}
      />
      <Stack.Screen
        name={AppNavigator.ReturnProductsScreen}
        component={ReturnProductsScreen}
        options={getScreenOptions({
          title: t('returnProducts'),
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
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: t('returnProducts'),
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: t('returnProducts'),
          leftBarButtonType: LeftBarType.Close,
        })}
      />
    </Stack.Navigator>
  );
});
