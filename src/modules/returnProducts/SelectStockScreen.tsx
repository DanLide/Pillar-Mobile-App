import React, { useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { RESULTS } from 'react-native-permissions';

import { AppNavigator, ReturnStackParamList } from '../../navigation/types';
import { ClearStoreType, StockProductStoreType } from '../../stores/types';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';
import { StocksList } from '../stocksList/components/StocksList';
import { returnProductsStore } from './stores';
import { useSingleToast } from '../../hooks';
import { ToastContextProvider } from '../../contexts';
import { ToastType } from '../../contexts/types';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  route: RouteProp<ReturnStackParamList, AppNavigator.SelectStockScreen>;
  navigation: NativeStackNavigationProp<
    ReturnStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const succeedBluetooth = route.params?.succeedBluetooth;

    const store = useRef<Store>(returnProductsStore).current;
    const isFocused = useIsFocused();
    const { showToast } = useSingleToast();

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
        store.clear();
      }
    }, [isFocused, store]);

    const onItemPress = (stock: StockModel) => {
      store.setCurrentStocks(stock);
      navigation.navigate(AppNavigator.ReturnProductsScreen);
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
  container: { flex: 1 },
  toastStyle: {
    gap: 8,
  },
});
