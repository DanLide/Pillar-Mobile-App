import React, { useCallback, useRef } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import {
  ProductEmptyList,
  SelectedProductsListItem,
} from '../../../components';
import { manageProductsStore } from '../stores';

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList: React.FC<Props> = observer(
  ({ onEditProduct }) => {
    const store = useRef<SyncedProductStoreType>(manageProductsStore).current;

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => (
        <SelectedProductsListItem
          hideOnHandCount
          item={item}
          onPress={onEditProduct}
        />
      ),
      [onEditProduct],
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
  },
);

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
});