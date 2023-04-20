import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { StockModel } from '../stores/StocksStore';
import { RoleType } from '../../../constants/common.enum';

interface Props {
  item: StockModel;
  onPressItem: (stock: StockModel) => void;
}

export const StocksListItem: React.FC<Props> = ({ item, onPressItem }) => {
  const { organizationName, leanTecSerialNo, roleTypeId } = item;

  const isLocked = !!leanTecSerialNo && roleTypeId === RoleType.Cabinet;

  const handlePress = useCallback(() => onPressItem(item), [item, onPressItem]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.underlineContainer}>
        <Text style={styles.title}>{organizationName}</Text>
        {isLocked && <Text style={styles.icon}>Unlock</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  underlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 8,
  },
  title: {
    fontSize: 18,
  },
  icon: {
    color: 'rgb(0, 122, 255)',
    fontSize: 15,
  },
});
