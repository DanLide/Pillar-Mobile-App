import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';

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
import { ToastContextProvider } from '../../contexts';

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

const SelectStockScreenBody = observer(({ navigation }: Props) => {
  const store = useRef<Store>(manageProductsStore).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      store.clear();
    }
  }, [isFocused, store]);

  const fetchStocks = useCallback(
    (store: StockStore) => fetchManageProductsStocks(store),
    [],
  );

  const onItemPress = (stock: StockModel) => {
    store.setCurrentStocks(stock);
    navigation.navigate(AppNavigator.ManageProductsScreen);
  };

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
  toastStyle: {
    gap: 8,
  },
});
