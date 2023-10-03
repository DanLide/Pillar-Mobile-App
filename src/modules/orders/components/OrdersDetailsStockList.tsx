import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel } from '../../../stores/types';
import { SVGs, colors, fonts } from '../../../theme';
import { OrderTitleByStatusType } from './StatusBadge';
import { OrderStatusType } from '../../../constants/common.enum';
import { ordersStore } from '../stores';

interface Props {
  productsByStockName: Record<string, ProductModel[]>;
  selectedStock?: string;

  onSelectProducts: (stockName: string) => void;
}

export const OrdersDetailsStockList: React.FC<Props> = observer(
  ({ productsByStockName, selectedStock, onSelectProducts }) => {
    const ordersStoreRef = useRef(ordersStore).current;
    const { currentOrder } = ordersStoreRef;

    if (!currentOrder) return null;

    const renderProduct = useCallback(
      (product: ProductModel) => (
        <View style={styles.productDetails} key={product.productId}>
          <View style={styles.productNameContainer}>
            <Text
              style={[styles.productText, styles.productName]}
              ellipsizeMode="clip"
              numberOfLines={1}
            >
              {product.name}
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
            <Text style={styles.productDetailsBold}>{product.receivedQty}</Text>
            /{product.orderedQty}
          </Text>
        </View>
      ),
      [],
    );

    const renderSelectedRadioButton = useCallback(
      (item: string) => {
        switch (currentOrder.order.status) {
          case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
          case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
          case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
            return (
              <View style={styles.radioButton}>
                {selectedStock === item ? (
                  <View style={styles.radioButtonPoint} />
                ) : null}
              </View>
            );
          case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
          case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
          case OrderTitleByStatusType[OrderStatusType.CLOSED]:
          case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
          default:
            return <View style={styles.radioButtonPlaceholder} />;
        }
      },
      [currentOrder.order.status, selectedStock],
    );

    const renderStockList = useCallback(
      ({ item }: ListRenderItemInfo<string>) => {
        const products = productsByStockName[item];
        return (
          <Pressable
            style={styles.stockContainer}
            onPress={() => onSelectProducts(item)}
          >
            {renderSelectedRadioButton(item)}
            <View style={styles.products}>
              <Text style={styles.stockName}>{item}</Text>
              {products.map(renderProduct)}
            </View>
          </Pressable>
        );
      },
      [
        onSelectProducts,
        productsByStockName,
        renderProduct,
        renderSelectedRadioButton,
      ],
    );

    return (
      <FlatList
        data={Object.keys(productsByStockName)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={renderStockList}
      />
    );
  },
);

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    marginLeft: 16,
    marginTop: 8,
    backgroundColor: colors.neutral30,
  },
  stockContainer: {
    flexDirection: 'row',
    paddingRight: 36,
  },
  products: {
    flex: 1,
  },
  stockName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    paddingVertical: 8,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 11,
    backgroundColor: colors.transparent,
    alignSelf: 'center',
    marginHorizontal: 8,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonPoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.purple,
  },
  radioButtonPlaceholder: {
    width: 38,
    height: 22,
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
});
