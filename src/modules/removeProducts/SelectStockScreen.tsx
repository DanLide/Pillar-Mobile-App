import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { List } from '../stocksList/components/List';
import { AppNavigator } from '../../navigation';
import { cabinetStore } from '../../stores';
import { Stock } from '../stocksList/stores/StocksStore';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const SelectStockScreen: React.FC<Props> = ({ navigation }) => {
  const onItemPress = (stock: Stock) => {
    cabinetStore.setCurrentStocks(stock);
    navigation.navigate(AppNavigator.RemoveProductsListView);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Identify your Stock location</Text>
      <List onPressItem={onItemPress} />
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
