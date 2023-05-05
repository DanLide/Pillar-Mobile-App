import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ScanningProductModel } from '../../removeProducts/stores/ScanningProductStore';

import { SVGs, colors, fonts } from '../../../theme';

interface Props {
  product: ScanningProductModel;
}

export const EditQuantityDescription: React.FC<Props> = ({ product }) => (
  <View style={styles.container}>
    <View
      style={[
        styles.partNumberContainer,
        product.isRecoverable ? styles.refundIconPadding : null,
      ]}
    >
      {product.isRecoverable ? (
        <SVGs.RefundIcon color={colors.purple} />
      ) : null}
      <View>
        <Text style={styles.partNo}>{product.partNo}</Text>
      </View>
    </View>
    <Text style={styles.name} numberOfLines={2} ellipsizeMode="middle">
      {product.name}
    </Text>
    <Text style={styles.size}>{product.size}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  partNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  refundIconPadding: {
    paddingRight: 24,
  },
  partNo: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.blackLight,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 17,
    lineHeight: 25.5,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    paddingTop: 5.75,
  },
  size: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingTop: 8,
  },
});
