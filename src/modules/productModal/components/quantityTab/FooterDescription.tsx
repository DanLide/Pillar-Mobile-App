import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, fonts } from '../../../../theme';
import { InventoryTypeBadge } from '../../../../components';
import { ProductModel } from '../../../../stores/types';
import { ProductModalType } from '../../ProductModal';

interface Props {
  type?: ProductModalType;
  product: ProductModel;
  hideOnHandCount?: boolean;
  onHand?: number;
}

const VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY = '99+';

export const FooterDescription: React.FC<Props> = ({
  type,
  hideOnHandCount,
  product,
  onHand = 0,
}) => {
  const renderValue = (value?: number) =>
    typeof value === 'number'
      ? value > 99
        ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY
        : value
      : null;

  const renderBudges = () => {
    switch (type) {
      case ProductModalType.ReceiveOrder:
        return (
          <View style={[styles.wrappedContainer, styles.container]}>
            <View style={styles.itemContainer}>
              <Text style={styles.title}>Remove by</Text>
              <InventoryTypeBadge
                inventoryUseTypeId={product.inventoryUseTypeId}
              />
            </View>

            <View style={[styles.itemContainer, { margin: 8 }]}>
              <Text style={styles.title}>Pieces Per Container</Text>
              <Text style={styles.subtitleInStock}>
                {renderValue(product.unitsPer)}
              </Text>
            </View>

            <View style={[styles.itemContainer, { margin: 8 }]}>
              <Text style={styles.title}>Shipment Quantity</Text>
              <Text style={styles.subtitleInStock}>
                {renderValue(product.shippedQty)}
              </Text>
            </View>

            <View style={[styles.itemContainer, { margin: 8 }]}>
              <Text style={styles.title}>On Hand</Text>
              <Text style={styles.subtitleInStock}>
                {renderValue(product.onHand)}
              </Text>
            </View>

            <View style={[styles.itemContainer, { margin: 8 }]}>
              <Text style={styles.title}>On Order</Text>
              <Text style={styles.subtitleInStock}>
                {renderValue(product.onOrder)}
              </Text>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.container}>
            {hideOnHandCount ? null : (
              <View style={[styles.itemContainer, { marginRight: 16 }]}>
                <Text style={styles.title}>In Stock</Text>
                <Text style={styles.subtitleInStock}>
                  {onHand > 99
                    ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY
                    : onHand}
                </Text>
              </View>
            )}

            <View style={styles.itemContainer}>
              <Text style={styles.title}>Remove by</Text>
              <InventoryTypeBadge
                inventoryUseTypeId={product.inventoryUseTypeId}
              />
            </View>
          </View>
        );
    }
  };
  return renderBudges();
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 32,
  },
  wrappedContainer: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 10,
    marginBottom: 4,
    width: 50,
    textAlign: 'center',
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
