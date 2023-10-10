import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  Text,
  Pressable,
} from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from 'src/stores/types';
import { ProductEmptyList, Separator } from 'src/components';
import { colors, fonts } from 'src/theme';
import { ordersStore } from '../stores';
import { getProductTotalCost } from 'src/modules/orders/helpers';

interface Props {
  onItemPress?: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

const ListEmptyComponent = memo(() => (
  <ProductEmptyList
    hideTitle
    subtitle="No Products added"
    style={styles.emptyContainer}
  />
));

export const SelectedProductsList: React.FC<Props> = observer(
  ({ onItemPress }) => {
    const store = useRef<SyncedProductStoreType>(ordersStore).current;

    const products = store.getNotSyncedProducts;

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

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => {
        const { manufactureCode, partNo, name, reservedCount } = item;

        const handlePress = () => onItemPress?.(item);

        return (
          <Pressable style={styles.item} onPress={handlePress}>
            <View style={styles.itemDetails}>
              <Text numberOfLines={1} style={styles.itemTitle}>
                {manufactureCode} {partNo}
              </Text>
              <Text numberOfLines={1} style={styles.itemSubtitle}>
                {name}
              </Text>
            </View>
            <Text style={styles.itemCounter}>{reservedCount}</Text>
            <Text style={[styles.itemCounter, styles.itemCounterRight]}>
              ${getProductTotalCost(item)}
            </Text>
          </Pressable>
        );
      },
      [onItemPress],
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
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
    lineHeight: 20,
  },
});
