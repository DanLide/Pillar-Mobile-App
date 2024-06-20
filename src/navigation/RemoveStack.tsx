import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  AppNavigator,
  LeftBarType,
  RightBarType,
  RemoveStackParamList,
} from './types';
import { SelectStockScreen } from '../modules/removeProducts/SelectStockScreen';
import { getScreenOptions } from './helpers';
import { RemoveProductsScreen } from '../modules/removeProducts/RemoveProductsScreen';
import { ScannerScreen } from '../modules/removeProducts/ScannerScreen';
import { ResultScreen } from '../modules/removeProducts/ResultScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import {
  CameraPermissionScreen,
  BluetoothPermissionScreen,
} from '../modules/permissions';
import permissionStore from '../modules/permissions/stores/PermissionStore';

import { getScreenName } from './helpers/getScreenName';

const Stack = createStackNavigator<RemoveStackParamList>();

export const RemoveStack: React.FC = observer(() => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName={getScreenName(permissionStore)}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: t('removeProducts'),
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
        name={AppNavigator.RemoveProductsScreen}
        component={RemoveProductsScreen}
        options={getScreenOptions({
          title: t('removeProducts'),
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
        name={AppNavigator.BluetoothPermissionScreen}
        component={BluetoothPermissionScreen}
        options={getScreenOptions({
          title: t('bluetoothConnection'),
          leftBarButtonType: LeftBarType.Back,
        })}
        initialParams={{ nextRoute: AppNavigator.SelectStockScreen }}
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: t('removeProducts'),
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: t('removeProducts'),
          leftBarButtonType: LeftBarType.Close,
        })}
      />
    </Stack.Navigator>
  );
});
