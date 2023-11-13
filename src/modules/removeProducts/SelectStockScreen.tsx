import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, AppState } from 'react-native';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import {
  RESULTS,
  PERMISSIONS,
} from 'react-native-permissions';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

import { StocksList } from '../stocksList/components/StocksList';
import { AppNavigator, RemoveStackParamList } from '../../navigation/types';
import { removeProductsStore } from './stores';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';

import { StockProductStoreType, ClearStoreType } from '../../stores/types';
import { useSingleToast } from '../../hooks';
import { ToastContextProvider } from '../../contexts';
import { ToastType } from '../../contexts/types';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  route: RouteProp<RemoveStackParamList, AppNavigator.SelectStockScreen>;
  navigation: NativeStackNavigationProp<
    RemoveStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const succeedBluetooth = route.params?.succeedBluetooth;
    const isBluetoothOn = permissionStore.isBluetoothOn;
    const bluetoothPermission = permissionStore.bluetoothPermission;
    const locationPermission = permissionStore.locationPermission;

    const store = useRef<Store>(removeProductsStore).current;
    const isFocused = useIsFocused();
    const { showToast, hideAll } = useSingleToast();
    
    const [isLocationPermissionRequested, setIsLocationPermissionRequested] = useState(false);

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
        store.clear();
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
      navigation.navigate(AppNavigator.RemoveProductsScreen);
    };

    return (
      <SafeAreaView style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Secondary}
          title="Select a Stock Location"
        />
        <StocksList onPressItem={onItemPress} />
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
  container: {
    flex: 1,
  },
  toastStyle: {
    gap: 8,
  },
});
