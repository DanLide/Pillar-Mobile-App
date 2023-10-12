import { isNil } from 'ramda';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ProductModel } from 'src/stores/types';
import { SVGs, colors, fonts } from 'src/theme';

interface Props {
  stockName: string;
  products: ProductModel[];
  orderId: number;

  totalProductsQty?: number;
  productContainerStyle?: StyleProp<ViewStyle>;
  stockNameStyle?: StyleProp<TextStyle>;
}

export const StockWithProducts: React.FC<Props> = ({
  orderId,
  products,
  stockName,
  productContainerStyle,
  totalProductsQty,
  stockNameStyle,
}) => {
  const renderProduct = useCallback(
    ({ item, index }: ListRenderItemInfo<ProductModel>) => (
      <View
        style={[styles.productDetails, productContainerStyle]}
        key={`${index}-${orderId}-${item.productId}`}
      >
        <View style={styles.productNameContainer}>
          <Text
            style={[styles.productText, styles.productName]}
            ellipsizeMode="clip"
            numberOfLines={1}
          >
            {item.product}
            <SVGs.DashedLine
              style={styles.dashedLine}
              color={colors.neutral40}
            />
            <SVGs.DashedLine
              style={styles.dashedLine}
              color={colors.neutral40}
            />
          </Text>
        </View>
        <Text style={styles.productText}>
          <Text style={styles.productDetailsBold}>{item.receivedQty}</Text>/
          {item.orderedQty}
        </Text>
      </View>
    ),
    [orderId, productContainerStyle],
  );

  return (
    <View style={styles.products}>
      <Text style={[styles.stockName, stockNameStyle]}>{stockName}</Text>
      {!isNil(totalProductsQty) ? (
        <Text style={styles.productQty}>{totalProductsQty} Products</Text>
      ) : null}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => `${item.productId}-${orderId}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  products: {
    flex: 1,
  },
  stockName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    paddingVertical: 8,
  },
  productDetails: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  productDetailsBold: {
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    fontSize: 14,
  },
  productNameContainer: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  productText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  productName: {
    paddingRight: 24,
  },
  dashedLine: {
    alignSelf: 'flex-end',
  },
  productQty: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.black,
    fontFamily: fonts.TT_Bold,
  },
});
