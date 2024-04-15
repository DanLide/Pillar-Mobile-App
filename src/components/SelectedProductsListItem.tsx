import { memo, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ProductModel } from '../stores/types';
import { colors, fonts } from '../theme';
import { Flows } from 'src/modules/types';

interface Props {
  item: ProductModel;
  disabled?: boolean;
  hideOnHandCount?: boolean;
  onPress?: (item: ProductModel) => void;
  flow?: Flows;
}

const { width } = Dimensions.get('window');

export const SelectedProductsListItem = memo(
  ({ item, disabled, hideOnHandCount, onPress, flow }: Props) => {
    const { name, manufactureCode, partNo, size, reservedCount, onHand } = item;

    const handlePress = useCallback(() => onPress?.(item), [item, onPress]);

    const OnHandCount = () => {
      if (flow === Flows.CreateInvoice) {
        return <Text style={styles.qtyLabel}> Qty</Text>;
      }
      return <Text style={styles.onHand}>/{onHand}</Text>;
    };

    return (
      <TouchableOpacity
        disabled={disabled}
        style={styles.container}
        onPress={handlePress}
      >
        <View style={styles.leftContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.description}>
            {manufactureCode} {partNo} {size}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.reservedCount}>
            {reservedCount}
            {!hideOnHandCount && <OnHandCount />}
          </Text>
        </View>
        <View style={styles.borderLine} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  borderLine: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width - 16,
    height: 1,
    backgroundColor: colors.gray,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 19,
    paddingVertical: 9.5,
    backgroundColor: colors.white,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
  },
  leftContainer: {
    flex: 3,
  },
  onHand: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackSemiLight,
    fontFamily: fonts.TT_Regular,
  },
  qtyLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
  },
  rightContainer: {
    flex: 1,
    alignSelf: 'center',
    color: colors.blackSemiLight,
    paddingRight: 35,
  },
  reservedCount: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Bold,
    textAlign: 'right',
    color: colors.purpleDark,
  },
  title: {
    color: colors.purpleDark,
    fontSize: 15,
    lineHeight: 30,
    fontFamily: fonts.TT_Bold,
  },
});
