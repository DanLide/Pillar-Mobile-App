import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { StockModel } from '../stores/StocksStore';

interface Props {
  item: StockModel;
  onPressItem: (stock: StockModel) => void;
}

export const StocksListItem: React.FC<Props> = ({ item, onPressItem }) => (
  <TouchableOpacity style={styles.container} onPress={() => onPressItem(item)}>
    <View style={styles.underlineContainer}>
      <Text style={styles.title}>{item.organizationName}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  underlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  title: {
    fontSize: 18,
    margin: 8,
  },
});
