import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ScanningProductModel } from '../../../removeProducts/stores/ScanningProductStore';
import { colors, fonts } from '../../../../theme';
import { productModalStore } from '../../store';
import { InventoryUseType } from '../../../../constants/common.enum';

const InventoryTypeName = {
  [InventoryUseType.Stock]: 'Stock',
  [InventoryUseType.Percent]: 'Percent',
  [InventoryUseType.Container]: 'Container',
  [InventoryUseType.Each]: 'Each Piece',
  [InventoryUseType.NonStock]: 'NonStock',
  [InventoryUseType.All]: 'All',
};

interface Props {
  product: ScanningProductModel;
}

const VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY = '99+';

export const FooterDescription: React.FC<Props> = ({ product }) => {
  const store = useRef(productModalStore).current;
  const InventoryTypeNameString = store.getProduct?.inventoryUseTypeId
    ? InventoryTypeName[store.getProduct.inventoryUseTypeId]
    : undefined;

  return (
    <View style={styles.container}>
      <View style={[styles.itemContainer, { marginRight: 16 }]}>
        <Text style={styles.title}>In Stock</Text>
        <Text style={styles.subtitleInStock}>
          {product.onHand > 99
            ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY
            : product.onHand}
        </Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.title}>Remove by</Text>
        {InventoryTypeNameString ? (
          <Text style={styles.subtitleRemoveBy}>{InventoryTypeNameString}</Text>
        ) : null}
      </View>
    </View>
  );
};

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
  subtitleRemoveBy: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.green,
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingHorizontal: 13,
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
