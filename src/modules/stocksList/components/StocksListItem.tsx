import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { StockModel } from '../stores/StocksStore';
import { RoleType } from '../../../constants/common.enum';
import { colors, fonts, SVGs } from '../../../theme';

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
        <View style={styles.statusContainer}>
          {isLocked && <Text style={styles.statusText}>Unlock</Text>}
          <SVGs.ChevronIcon color={colors.purpleDark} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65.5,
    paddingLeft: 16,
    backgroundColor: colors.white,
  },
  underlineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    paddingLeft: 5,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.TT_Regular,
    color: '#323234',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 22,
  },
  statusText: {
    paddingRight: 16,
    color: colors.purpleDark,
    fontSize: 18,
    lineHeight: 23.5,
    fontFamily: fonts.TT_Regular,
  },
});
