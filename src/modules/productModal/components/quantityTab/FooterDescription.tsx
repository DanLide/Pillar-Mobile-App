import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts } from 'src/theme';
import { InventoryTypeBadge } from 'src/components';
import { ProductModel } from 'src/stores/types';
import { ProductModalType } from '../../ProductModal';
import { InventoryUseType } from 'src/constants/common.enum';

interface Props {
  type?: ProductModalType;
  product: ProductModel;
  hideOnHandCount?: boolean;
  onHand?: number;
}

const VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY = '99+';

const renderValue = (value?: number) => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value > 99 ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY : value;
  }
  return '';
};

export const FooterDescription: React.FC<Props> = ({
  type,
  hideOnHandCount,
  product,
  onHand = 0,
}) => {
  const { t } = useTranslation();
  const isEachPiece = product?.inventoryUseTypeId === InventoryUseType.Each;

  const shipmentQuantity = useMemo(() => {
    switch (type) {
      case ProductModalType.ReceiveOrder:
        return product.shippedQty;
      default:
        return product.orderMultiple;
    }
  }, [product.orderMultiple, product.shippedQty, type]);

  return useMemo(() => {
    switch (type) {
      case ProductModalType.ReceiveOrder:
      case ProductModalType.CreateOrder:
      case ProductModalType.ReturnOrder:
      case ProductModalType.ReceiveBackOrder:
        return (
          <View style={styles.container}>
            {type === ProductModalType.CreateOrder && isEachPiece && (
              <Text style={styles.piecesCount}>
                {product.unitsPer} x {product.reservedCount} ={' '}
                {(product.unitsPer ?? 0) * (product.reservedCount ?? 0)}{' '}
                {t('pieces')}
              </Text>
            )}
            <View style={styles.wrappedContainer}>
              <View style={[styles.itemContainer, styles.mr8]}>
                <Text style={styles.title}>Remove by</Text>
                <InventoryTypeBadge
                  inventoryUseTypeId={product.inventoryUseTypeId}
                />
              </View>

              {isEachPiece && (
                <View style={[styles.itemContainer, styles.mr8]}>
                  <Text style={styles.title}>{t('piecesPerContainer')}</Text>
                  <Text style={styles.subtitleInStock}>
                    {renderValue(product.unitsPer)}
                  </Text>
                </View>
              )}

              <View style={[styles.itemContainer, styles.mr8]}>
                <Text style={styles.title}>{t('shipmentQuantity')}</Text>
                <Text style={styles.subtitleInStock}>
                  {renderValue(shipmentQuantity)}
                </Text>
              </View>

              <View style={[styles.itemContainer, styles.mr8]}>
                <Text style={styles.title}>{t('onHand')}</Text>
                <Text style={styles.subtitleInStock}>
                  {renderValue(product.onHand)}
                </Text>
              </View>

              <View style={[styles.itemContainer, styles.mr8]}>
                <Text style={styles.title}>{t('onOrder')}</Text>
                <Text style={styles.subtitleInStock}>
                  {renderValue(product.onOrder)}
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={[styles.wrappedContainer, { marginTop: 12 }]}>
            {hideOnHandCount ? null : (
              <View style={[styles.itemContainer, styles.mr16]}>
                <Text style={styles.title}>{t('onHand')}</Text>
                <Text style={styles.subtitleInStock}>
                  {onHand > 99
                    ? VIEW_STRING_OF_UPPER_LIMIT_PRODUCT_QUANTITY
                    : onHand}
                </Text>
              </View>
            )}

            <View style={styles.itemContainer}>
              <Text style={styles.title}>{t('removeBy')}</Text>
              <InventoryTypeBadge
                inventoryUseTypeId={product.inventoryUseTypeId}
              />
            </View>
          </View>
        );
    }
  }, [
    hideOnHandCount,
    isEachPiece,
    onHand,
    product.inventoryUseTypeId,
    product.onHand,
    product.onOrder,
    product.reservedCount,
    product.unitsPer,
    shipmentQuantity,
    type,
    t,
  ]);
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 32,
  },
  wrappedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
  piecesCount: {
    color: colors.textNeutral,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
    lineHeight: 18,
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
  mr8: {
    marginRight: 8,
  },
  mr16: {
    marginRight: 16,
  },
});
