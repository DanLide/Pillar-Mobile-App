import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import {
  ProductEmptyList,
  SelectedProductsListItem,
} from '../../../components';
import { colors, fonts } from '../../../theme';
import { ordersStore } from '../stores';

const keyExtractor = (item: ProductModel): string => item.uuid;

const ListEmptyComponent: React.FC = memo(() => (
  <ProductEmptyList
    hideTitle
    subtitle="No Products added"
    style={styles.emptyContainer}
  />
));

export const SelectedProductsList: React.FC = observer(() => {
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
    ({ item }: ListRenderItemInfo<ProductModel>) => (
      <SelectedProductsListItem item={item} />
    ),
    [],
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeader}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  emptyContainer: {
    justifyContent: 'flex-start',
    paddingTop: 44,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.grayLight,
    paddingVertical: 5,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  headerTitleLeft: {
    color: colors.textNeutral,
    flex: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 19,
  },
  headerTitleRight: {
    color: colors.textNeutral,
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingRight: 35,
  },
});
