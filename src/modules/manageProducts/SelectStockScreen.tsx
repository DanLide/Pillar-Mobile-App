import React, { memo, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused } from '@react-navigation/native';

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

interface Props {
  navigation: NativeStackNavigationProp<
    ManageProductsStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

export const SelectStockScreen = memo(({ navigation }: Props) => {
  const store = useRef<Store>(manageProductsStore).current;
  const isFocused = useIsFocused();

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

const styles = StyleSheet.create({
  container: { flex: 1 },
});
