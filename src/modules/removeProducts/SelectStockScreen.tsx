import React, { useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { RESULTS } from 'react-native-permissions';
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
    const store = useRef<Store>(removeProductsStore).current;
    const isFocused = useIsFocused();
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
        store.clear();
      }
    }, [isFocused, store]);

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
});
