import { isNil } from 'ramda';
import { useCallback } from 'react';
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
import { RoleType } from 'src/constants/common.enum';
import { LockStatus, LockVisibility } from 'src/data/masterlock';
import { stocksStore } from 'src/modules/stocksList/stores';
import { ProductModel } from 'src/stores/types';
import { SVGs, colors, fonts } from 'src/theme';
import { masterLockStore, ssoStore } from 'src/stores';

interface Props {
  stockName: string;
  stockId: string;
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
  stockId,
  productContainerStyle,
  totalProductsQty,
  stockNameStyle,
}) => {
  const stockItem = stocksStore.stocks.find(
    stock => stock.partyRoleId === Number(stockId),
  );
  const isDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;
  const controllerSerialNo = stockItem?.controllerSerialNo || '';
  const isVisible =
    masterLockStore.stocksState[controllerSerialNo]?.visibility ===
    LockVisibility.VISIBLE;

  const lockStatus = masterLockStore.stocksState[controllerSerialNo]?.status;

  const renderIcon = () => {
    if (
      (stockItem?.roleTypeId !== RoleType.Cabinet && isVisible) ||
      !isDeviceConfiguredBySSO
    ) {
      return <SVGs.CabinetSimple />;
    }
    switch (lockStatus) {
      case LockStatus.UNLOCKED:
      case LockStatus.OPEN:
        return <SVGs.CabinetOpen />;
      case LockStatus.LOCKED:
      case LockStatus.PENDING_UNLOCK:
      case LockStatus.PENDING_RELOCK:
        return <SVGs.CabinetLocked />;
      case LockStatus.OPEN_LOCKED:
        return <SVGs.CabinetOpenLocked />;
      case LockStatus.UNKNOWN:
        return <SVGs.CabinetError />;
      default:
        return <SVGs.CabinetSimple />;
    }
  };

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
      <View style={styles.titleContainer}>
        <Text style={[styles.stockName, stockNameStyle]}>{stockName}</Text>
        {renderIcon()}
      </View>
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
    marginRight: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
