import React, { useCallback, useRef } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { observer } from 'mobx-react';

import { ProductEmptyList, SelectedProductsListItem } from './';
import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../stores/types';
import { ProductModalType } from '../modules/productModal';

type Store =
  | (ScannerModalStoreType &
      CurrentProductStoreType &
      SyncedProductStoreType &
      StockProductStoreType)
  | undefined;

interface Props {
  modalType?: ProductModalType;
  store?: Store;
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const BaseSelectedProductsList: React.FC<Props> = observer(
  ({ store, modalType, onEditProduct }) => {
    const syncedStore = useRef<Store>(store).current;

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => (
        <SelectedProductsListItem
          hideOnHandCount={modalType === ProductModalType.CreateInvoice}
          item={item}
          onPress={onEditProduct}
        />
      ),
      [modalType, onEditProduct],
    );

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={syncedStore?.getNotSyncedProducts}
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