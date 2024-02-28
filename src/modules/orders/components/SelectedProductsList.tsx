import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleProp,
  TextStyle,
} from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from 'src/stores/types';
import { ProductEmptyList, Separator } from 'src/components';
import { colors, fonts } from 'src/theme';
import { ordersStore } from '../stores';
import { getProductTotalCost } from 'src/modules/orders/helpers';
import { OrderType, RoleType } from 'src/constants/common.enum';
import { StocksListItem } from 'src/modules/stocksList/components/StocksListItem';
import { stocksStore } from 'src/modules/stocksList/stores';
import { masterLockStore } from 'src/stores';
import { fetchStocks } from 'src/data/fetchStocks';

interface Props {
  isLoading?: boolean;
  itemTitleColor?: string;
  orderType?: OrderType;
  onItemPress?: (item: ProductModel) => void;
  withStockLocation?: boolean;
  nextNavigationGoBack?: boolean;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList: React.FC<Props> = observer(
  ({
    isLoading,
    itemTitleColor = colors.purpleDark,
    orderType,
    onItemPress,
    withStockLocation,
    nextNavigationGoBack,
  }) => {
    const store = useRef<SyncedProductStoreType>(ordersStore).current;

    const products = isLoading ? [] : store.getNotSyncedProducts;

    const isPurchaseOrder = orderType === OrderType.Purchase;

    const ListHeader = useMemo(
      () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleLeft}>Product</Text>
          <Text style={styles.headerTitleRight}>Quantity</Text>
          <Text style={styles.headerTitleRight}>Cost</Text>
        </View>
      ),
      [],
    );

    const initMasterLock = useCallback(async () => {
      await fetchStocks(stocksStore);
      if (!stocksStore.stocks.length) return;
      await masterLockStore.initMasterLockForStocks(stocksStore.stocks);
    }, [stocksStore.stocks.length]);

    useEffect(() => {
      initMasterLock();
    }, []);

    const ListEmptyComponent = useMemo(
      () =>
        isLoading ? (
          <ActivityIndicator size="large" style={{ padding: 16 }} />
        ) : (
          <ProductEmptyList
            hideTitle
            subtitle="No Products added"
            style={isPurchaseOrder && styles.emptyContainer}
          />
        ),
      [isLoading, isPurchaseOrder],
    );

    const itemTitleStyle = useMemo<StyleProp<TextStyle>>(
      () => [styles.itemTitle, { color: itemTitleColor }],
      [itemTitleColor],
    );

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => {
        const { manufactureCode, partNo, name, reservedCount } = item;
        let stockModel;
        if (withStockLocation) {
          stockModel = stocksStore.stocks.find(stock => {
            return stock.partyRoleId === item.storageAreaId;
          });
        }

        const handlePress = () => onItemPress?.(item);

        return (
          <Pressable onPress={handlePress}>
            {stockModel && (
              <StocksListItem
                item={stockModel}
                containerStyle={styles.stockContainer}
                subContainer={styles.subContainer}
                nextNavigationGoBack={nextNavigationGoBack}
              />
            )}
            <View style={styles.item}>
              <View style={styles.itemDetails}>
                <Text numberOfLines={1} style={itemTitleStyle}>
                  {manufactureCode} {partNo}
                </Text>
                <Text numberOfLines={1} style={styles.itemSubtitle}>
                  {name}
                </Text>
              </View>
              <Text style={styles.itemCounter}>{reservedCount}</Text>
              <Text style={[styles.itemCounter, styles.itemCounterRight]}>
                ${getProductTotalCost(item).toFixed(2)}
              </Text>
            </View>
          </Pressable>
        );
      },
      [itemTitleStyle, onItemPress],
    );

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeader}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  emptyContainer: {
    justifyContent: 'flex-start',
    paddingTop: 44,
  },
  headerTitleContainer: {
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 5,
    paddingLeft: 16,
    paddingRight: 8,
  },
  headerTitleLeft: {
    color: colors.textNeutral,
    flex: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
  },
  headerTitleRight: {
    color: colors.textNeutral,
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
  },
  item: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 24,
    paddingRight: 32,
    paddingVertical: 2,
  },
  itemCounter: {
    color: colors.blackSemiLight,
    flex: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  itemCounterRight: {
    textAlign: 'right',
  },
  itemDetails: {
    flex: 4,
  },
  itemSubtitle: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    lineHeight: 16,
  },
  itemTitle: {
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
    lineHeight: 20,
  },
  stockContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  subContainer: {
    borderBottomWidth: 0,
  },
});
