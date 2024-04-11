import React, { useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel } from '../../../stores/types';
import { colors, fonts } from '../../../theme';
import { OrderTitleByStatusType } from './StatusBadge';
import { OrderStatusType } from '../../../constants/common.enum';
import { ordersStore } from '../stores';
import { StockWithProducts } from './StockWithProducts';
import { permissionProvider } from 'src/data/providers';

interface Props {
  productsByStockId: Record<string, ProductModel[]>;
  selectedStock?: string;

  onSelectProducts: (stockName: string, stockId: string) => void;
  contentContainerStyle: StyleProp<ViewStyle>;
}

export const OrdersDetailsStockList: React.FC<Props> = observer(
  ({
    productsByStockId,
    selectedStock,
    onSelectProducts,
    contentContainerStyle,
  }) => {
    const ordersStoreRef = useRef(ordersStore).current;
    const { currentOrder } = ordersStoreRef;
    const { userPermissions } = permissionProvider;

    if (!currentOrder) return null;

    const isOrderReceivable = useMemo(() => {
      if (!userPermissions.receiveOrder) {
        return false;
      }

      switch (currentOrder.order.status) {
        case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
        case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
        case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
          return true;
        case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
        case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
        case OrderTitleByStatusType[OrderStatusType.CLOSED]:
        case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
        default:
          return false;
      }
    }, [currentOrder.order.status, userPermissions]);

    const renderSelectedRadioButton = useCallback(
      (item: string) =>
        isOrderReceivable ? (
          <View style={styles.radioButton}>
            {selectedStock === item ? (
              <View style={styles.radioButtonPoint} />
            ) : null}
          </View>
        ) : (
          <View style={styles.radioButtonPlaceholder} />
        ),
      [isOrderReceivable, selectedStock],
    );

    const renderStockList = useCallback(
      ({ item }: ListRenderItemInfo<string>) => {
        const products = productsByStockId[item];
        const stockName = products[0].stockLocationName || '';
        return (
          <Pressable
            style={styles.stockContainer}
            onPress={() => onSelectProducts(stockName, item)}
            disabled={!isOrderReceivable}
          >
            {isOrderReceivable ? (
              renderSelectedRadioButton(stockName)
            ) : (
              <View style={styles.radioButtonPlaceholder} />
            )}
            <StockWithProducts
              stockName={stockName}
              products={products}
              stockId={item}
              orderId={currentOrder.order.orderId}
            />
          </Pressable>
        );
      },
      [
        currentOrder.order.orderId,
        isOrderReceivable,
        onSelectProducts,
        productsByStockId,
        renderSelectedRadioButton,
      ],
    );

    return (
      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={Object.keys(productsByStockId)}
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
