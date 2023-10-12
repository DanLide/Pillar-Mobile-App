import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { RESULTS } from 'react-native-permissions';

import {
  AppNavigator,
  ManageProductsStackParamList,
} from '../../navigation/types';
import { ClearStoreType, StockProductStoreType } from '../../stores/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';
import { StocksList } from '../stocksList/components/StocksList';
import { manageProductsStore } from './stores';
import { fetchManageProductsStocks } from '../../data/fetchManageProductStocks';
import { useSingleToast } from '../../hooks';
import { ToastContextProvider } from '../../contexts';
import { ToastType } from '../../contexts/types';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  route: RouteProp<
    ManageProductsStackParamList,
    AppNavigator.SelectStockScreen
  >;
  navigation: NativeStackNavigationProp<
    ManageProductsStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody = observer(({ navigation, route }: Props) => {
  const store = useRef<Store>(manageProductsStore).current;
  const isFocused = useIsFocused();
  const { showToast } = useSingleToast();
  const succeedBluetooth = route.params?.succeedBluetooth;

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
      store.clear();
    }
  }, [isFocused, store]);

  const onItemPress = (stock: StockModel) => {
    store.setCurrentStocks(stock);
    navigation.navigate(AppNavigator.ManageProductsScreen);
  };

  const fetchStocks = useCallback(
    (store: StockStore) => fetchManageProductsStocks(store),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Secondary}
        title="Select a Stock Location"
      />
      <StocksList onFetchStocks={fetchStocks} onPressItem={onItemPress} />
    </SafeAreaView>
  );
});

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
