import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import i18n from 'i18next';
import { getScreenOptions } from './helpers';
import { AppNavigator, LeftBarType, OrdersParamsList } from './types';

import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { OrderDetailsScreen } from '../modules/orders/OrderDetailsScreen';
import { OrderByStockLocationScreen } from '../modules/orders/OrderByStockLocationScreen';
import { SelectStockScreen } from '../modules/orders/SelectStockScreen';
import CreateOrderScreen from '../modules/orders/CreateOrderScreen';
import { ResultScreen } from '../modules/orders/ResultScreen';
import { BaseUnlockScreen } from '../components/BaseUnlockScreen';
import {
  BluetoothPermissionScreen,
  CameraPermissionScreen,
} from '../modules/permissions';
import { ScannerScreen } from '../modules/orders/ScannerScreen';
import { HowToScanScreen } from '../modules/howToScan/HowToScanScreen';
import { CreateOrderResultScreen } from 'src/modules/orders/CreateOrderResultScreen';
import { OrderType } from 'src/constants/common.enum';
import { ProductModalType } from 'src/modules/productModal';
import ReceiveBackorderScreen from 'src/modules/orders/ReceiveBackorderScreen';
import { BackOrderScannerScreen } from 'src/modules/orders/BackOrderScannerScreen';
import { BackOrderResultScreen } from 'src/modules/orders/BackorderResultScreen';

const Stack = createStackNavigator<OrdersParamsList>();

const getsScreenTitleByOrderType = (orderType?: OrderType) => {
  switch (orderType) {
    case OrderType.Purchase:
      return i18n.t('createOrder');
    case OrderType.Return:
      return i18n.t('returnOrder');
    default:
      return i18n.t('manageOrders');
  }
};

export const OrdersStack: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName={AppNavigator.OrdersScreen}>
      <Stack.Screen
        name={AppNavigator.OrdersScreen}
        component={OrdersScreen}
        options={getScreenOptions({
          title: t('manageOrders'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.OrderDetailsScreen}
        component={OrderDetailsScreen}
        options={getScreenOptions({
          title: t('viewOrder'),
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
        name={AppNavigator.OrderByStockLocationScreen}
        component={OrderByStockLocationScreen}
        options={getScreenOptions({
          title: '',
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.SelectStockScreen}
        component={SelectStockScreen}
        options={({ route: { params } }) =>
          getScreenOptions({
            title: getsScreenTitleByOrderType(params?.orderType),
            leftBarButtonType: LeftBarType.Back,
          })
        }
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
        initialParams={{ nextScreen: AppNavigator.CreateOrderScreen }}
      />
      <Stack.Screen
        name={AppNavigator.CreateOrderScreen}
        component={CreateOrderScreen}
        options={({ route: { params } }) =>
          getScreenOptions({
            title: getsScreenTitleByOrderType(params?.orderType),
            leftBarButtonType: LeftBarType.Back,
          })
        }
      />
      <Stack.Screen
        name={AppNavigator.ResultScreen}
        component={ResultScreen}
        options={getScreenOptions({
          title: t('resultScreen'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.CreateOrderResultScreen}
        component={CreateOrderResultScreen}
        options={({ route: { params } }) =>
          getScreenOptions({
            title: getsScreenTitleByOrderType(params?.orderType),
            leftBarButtonType: LeftBarType.Back,
          })
        }
      />
      <Stack.Screen
        name={AppNavigator.ScannerScreen}
        component={ScannerScreen}
        options={({ route: { params } }) =>
          getScreenOptions({
            title:
              params?.modalType === ProductModalType.CreateOrder
                ? t('createOrder')
                : t('returnOrder'),
            leftBarButtonType: LeftBarType.Back,
          })
        }
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
        name={AppNavigator.ReceiveBackorderScreen}
        component={ReceiveBackorderScreen}
        options={getScreenOptions({
          title: t('receiveBackorder'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.BackorderScannerScreen}
        component={BackOrderScannerScreen}
        options={getScreenOptions({
          title: t('receiveBackorder'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
      <Stack.Screen
        name={AppNavigator.BackOrderResultScreen}
        component={BackOrderResultScreen}
        options={getScreenOptions({
          title: t('receiveBackorder'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
