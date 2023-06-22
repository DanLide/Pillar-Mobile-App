import React, { useCallback, useRef } from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import { returnProductsStore } from '../stores';
import { ProductEmptyList } from '../../../components';

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList = observer(() => {
  const store = useRef<SyncedProductStoreType>(returnProductsStore).current;

  // TODO: implement renderItem
  const renderItem = useCallback<ListRenderItem<ProductModel>>(
    ({ item }) => <></>,
    [],
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={store.getNotSyncedProducts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ProductEmptyList}
    />
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
});
