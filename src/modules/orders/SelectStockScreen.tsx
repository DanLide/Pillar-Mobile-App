import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { RESULTS } from 'react-native-permissions';

import { AppNavigator, OrdersParamsList } from '../../navigation/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { StocksList } from '../stocksList/components/StocksList';
import { ordersStore } from './stores';
import { fetchOrdersStocks } from '../../data/fetchOrdersStocks';
import { useSingleToast } from '../../hooks';
import { ToastContextProvider } from '../../contexts';
import { ToastType } from '../../contexts/types';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.SelectStockScreen
  >;
  route: RouteProp<OrdersParamsList, AppNavigator.SelectStockScreen>;
}

const SelectStockScreenBody: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const store = useRef(ordersStore).current;
    const isFocused = useIsFocused();
    const succeedBluetooth = route.params?.succeedBluetooth;
    const { showToast } = useSingleToast();

    useEffect(() => {
      if (succeedBluetooth) {
        showToast('Bluetooth successfully connected', {
          type: ToastType.BluetoothEnabled,
        });
        return;
      }
      autorun(() => {
        if (permissionStore.bluetoothPermission !== RESULTS.GRANTED) {
          showToast('Bluetooth not connected', {
            type: ToastType.BluetoothDisabled,
            onPress: () => {
              permissionStore.openSetting();
            },
          });
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
      navigation.navigate(AppNavigator.CreateOrderScreen);
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
});
