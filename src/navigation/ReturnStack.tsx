import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

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
  return (
    <Stack.Navigator initialRouteName={getScreenName(permissionStore)}>
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={getScreenOptions({
          title: 'Return Products',
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
        initialParams={{ nextScreen: AppNavigator.ReturnProductsScreen }}
      />
      <Stack.Screen
        name={AppNavigator.BluetoothPermissionScreen}
        component={BluetoothPermissionScreen}
        options={getScreenOptions({
          title: 'Bluetooth Connection',
          leftBarButtonType: LeftBarType.Back,
        })}
        initialParams={{ nextRoute: AppNavigator.SelectStockScreen }}
      />
      <Stack.Screen
        name={AppNavigator.ReturnProductsScreen}
        component={ReturnProductsScreen}
        options={getScreenOptions({
          title: 'Return Products',
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
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={getScreenOptions({
          title: 'Return Products',
          leftBarButtonType: LeftBarType.Back,
          rightBarButtonType: RightBarType.QuestionMark,
        })}
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: 'Return Products',
          leftBarButtonType: LeftBarType.Close,
        })}
      />
    </Stack.Navigator>
  );
});
