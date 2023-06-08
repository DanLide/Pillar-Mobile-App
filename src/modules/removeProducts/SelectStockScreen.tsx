import React, { useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import { StocksList } from '../stocksList/components/StocksList';
import { AppNavigator } from '../../navigation';
import { removeProductsStore } from './stores';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';

import { StockProductStoreType, ClearStoreType } from '../../stores/types';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

type Store = StockProductStoreType & ClearStoreType;

export const SelectStockScreen: React.FC<Props> = ({ navigation }) => {
  const store = useRef<Store>(removeProductsStore).current;
  const isFocused = useIsFocused();

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#D3D3D3',
  },
});
