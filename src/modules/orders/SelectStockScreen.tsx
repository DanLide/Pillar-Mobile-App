import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused } from '@react-navigation/native';

import { AppNavigator, OrdersParamsList } from '../../navigation/types';
import { ClearStoreType, StockProductStoreType } from '../../stores/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { StocksList } from '../stocksList/components/StocksList';
import { ordersStore } from './stores';
import { fetchOrdersStocks } from '../../data/fetchOrdersStocks';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

export const SelectStockScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef<Store>(ordersStore).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      store.clear();
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
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
