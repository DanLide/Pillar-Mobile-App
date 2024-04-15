import { useCallback, useRef } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import { returnProductsStore } from '../stores';
import {
  ProductEmptyList,
  SelectedProductsListItem,
} from '../../../components';

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList: React.FC<Props> = observer(
  ({ onEditProduct }) => {
    const store = useRef<SyncedProductStoreType>(returnProductsStore).current;

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => (
        <SelectedProductsListItem item={item} onPress={onEditProduct} />
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
