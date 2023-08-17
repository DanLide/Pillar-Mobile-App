import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, fonts } from '../../../../theme';
import { InventoryTypeBadge } from '../../../../components';
import { ProductModel } from '../../../../stores/types';

interface Props {
  product: ProductModel;
  hideOnHandCount?: boolean;
  onHand?: number;
}

const VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY = '99+';

export const FooterDescription: React.FC<Props> = ({
  hideOnHandCount,
  product,
  onHand = 0,
}) => (
  <View style={styles.container}>
    {hideOnHandCount ? null : (
      <View style={[styles.itemContainer, { marginRight: 16 }]}>
        <Text style={styles.title}>In Stock</Text>
        <Text style={styles.subtitleInStock}>
          {onHand > 99 ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY : onHand}
        </Text>
      </View>
    )}

    <View style={styles.itemContainer}>
      <Text style={styles.title}>Remove by</Text>
      <InventoryTypeBadge inventoryUseTypeId={product.inventoryUseTypeId} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  itemContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 10,
    marginBottom: 4,
  },
  subtitleInStock: {
    color: colors.blackLight,
    backgroundColor: colors.gray,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 2,
    paddingHorizontal: 13,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: fonts.TT_Bold,
    letterSpacing: 0,
  },
});
