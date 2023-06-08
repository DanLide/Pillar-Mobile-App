import React, { useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import { StocksList } from '../stocksList/components/StocksList';
import { AppNavigator } from '../../navigation';
import { removeProductsStore, scanningProductStore } from './stores';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const SelectStockScreen: React.FC<Props> = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      removeProductsStore.clear();
      scanningProductStore.clear();
    }
  }, [isFocused]);

  const onItemPress = (stock: StockModel) => {
    removeProductsStore.setCurrentStocks(stock);
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
