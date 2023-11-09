import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  AppState,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import {
  RESULTS,
  PERMISSIONS,
} from 'react-native-permissions';

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
    const { showToast, hideAll } = useSingleToast();
    const [isLocationPermissionRequested, setIsLocationPermissionRequested] = useState(false);

    const succeedBluetooth = params?.succeedBluetooth;
    const isBluetoothOn = permissionStore.isBluetoothOn;
    const bluetoothPermission = permissionStore.bluetoothPermission;
    const locationPermission = permissionStore.locationPermission;

    const orderType = params?.orderType;

    useEffect(() => {
      if (
        locationPermission !== RESULTS.GRANTED &&
        locationPermission !== RESULTS.DENIED &&
        isLocationPermissionRequested
      ) {
        showToast('Location permissions not granted', {
          type: ToastType.BluetoothDisabled,
          onPress: () => {
            permissionStore.openSetting();
          },
        });
        return;
      }
      if (succeedBluetooth && isBluetoothOn) {
        showToast('Bluetooth successfully connected',
          { type: ToastType.BluetoothEnabled },
        )
        return;
      }
      if (bluetoothPermission !== RESULTS.GRANTED) {
        showToast('Bluetooth not connected', {
          type: ToastType.BluetoothDisabled,
          onPress: () => {
            permissionStore.openSetting();
          },
        });
        return;
      }
      if (!isBluetoothOn) {
        showToast('Make sure Bluetooth is enabled, bluetooth not connected',
          {
            type: ToastType.BluetoothDisabled,
            onPress: () => { permissionStore.openBluetoothPowerSetting() },
            style: styles.toastStyle,
          },
        )
        return
      }
      hideAll();
    }, [
      hideAll,
      showToast,
      navigation,
      succeedBluetooth,
      isLocationPermissionRequested,
      bluetoothPermission,
      isBluetoothOn,
      locationPermission,
    ]);

    useEffect(() => {
      if (isFocused) {
        store.clearCreateOrReceiveBackOrder();
      }
    }, [isFocused, store]);


    useEffect(() => {
      const lister = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          setIsLocationPermissionRequested(false);
        }
      });
      return () => {
        lister.remove()
      }
    }, []);

    const fetchStocks = useCallback(
      (store: StockStore) => fetchOrdersStocks(store),
      [],
    );

    if ((
      locationPermission === RESULTS.UNAVAILABLE ||
      locationPermission === RESULTS.DENIED ||
      locationPermission === RESULTS.BLOCKED
    ) && !isLocationPermissionRequested) {
      const requestPerm = async () => {
        await permissionStore.requestPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        setIsLocationPermissionRequested(true);
      }
      requestPerm();
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      )
    }

    const onItemPress = (stock: StockModel) => {
      store.setCurrentStocks(stock);
      navigation.navigate(AppNavigator.CreateOrderScreen, { orderType });
    };



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
