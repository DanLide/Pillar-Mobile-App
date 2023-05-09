import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScanningProductModel } from '../../../stores/ScanningProductStore';
import { colors, fonts } from '../../../../../theme';
import { productModalStore } from '../../store';

interface Props {
  product: ScanningProductModel;
}

export const FooterDescription: React.FC<Props> = ({ product }) => {
  const store = useRef(productModalStore).current;

  return (
    <View style={styles.container}>
      <View style={[styles.itemContainer, { marginRight: 16 }]}>
        <Text style={styles.title}>In Stock</Text>
        <Text style={styles.subtitleInStock}>
          {product.onHand > 99 ? '99+' : product.onHand}
        </Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.title}>Remove by</Text>
        {store?.userTypeName ? (
          <Text style={styles.subtitleRemoveBy}>{store.userTypeName}</Text>
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
