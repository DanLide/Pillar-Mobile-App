import React, { useCallback, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { RESULTS } from 'react-native-permissions';

import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { StocksList } from '../stocksList/components/StocksList';
import { ordersStore } from './stores';
import { fetchOrdersStocks } from 'src/data/fetchOrdersStocks';
import { useSingleToast } from 'src/hooks';
import { ToastContextProvider } from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.SelectStockScreen
  >;
  route: RouteProp<OrdersParamsList, AppNavigator.SelectStockScreen>;
}

const SelectStockScreenBody: React.FC<Props> = observer(
  ({ navigation, route: { params } }) => {
    const store = useRef(ordersStore).current;
    const isFocused = useIsFocused();
    const { showToast } = useSingleToast();

    const succeedBluetooth = params?.succeedBluetooth;
    const orderType = params?.orderType;

    useEffect(() => {
      autorun(() => {
        if (succeedBluetooth && permissionStore.isBluetoothOn) {
          showToast('Bluetooth successfully connected',
            { type: ToastType.BluetoothEnabled },
          )
          return;
        }
        if (permissionStore.bluetoothPermission !== RESULTS.GRANTED) {
          showToast('Bluetooth not connected', {
            type: ToastType.BluetoothDisabled,
            onPress: () => {
              permissionStore.openSetting();
            },
          });
          return;
        }
        if (!permissionStore.isBluetoothOn) {
          showToast('Make sure Bluetooth is enabled, bluetooth not connected',
            {
              type: ToastType.BluetoothDisabled,
              onPress: () => { permissionStore.openBluetoothPowerSetting() },
              style: styles.toastStyle,
            },
          )
        }
      });
    }, [showToast, navigation, succeedBluetooth]);

    useEffect(() => {
      if (isFocused) {
        store.clearCreateOrder();
      }
    }, [isFocused, store]);

    const onItemPress = (stock: StockModel) => {
      store.setCurrentStocks(stock);
      navigation.navigate(AppNavigator.CreateOrderScreen, { orderType });
    };

    const fetchStocks = useCallback(
      (store: StockStore) => fetchOrdersStocks(store),
      [],
    );

    return (
      <SafeAreaView style={styles.container}>
        <StocksList onFetchStocks={fetchStocks} onPressItem={onItemPress} />
      </SafeAreaView>
    );
  },
);

export const SelectStockScreen: React.FC<Props> = props => {
  return (
    <ToastContextProvider>
      <SelectStockScreenBody {...props} />
    </ToastContextProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  toastStyle: {
    gap: 8,
  },
});
