import React, { memo, useCallback, useRef } from 'react';

import { removeProductsStore } from './stores';
import { BaseProductsScreen } from '../../components';
import { ProductModalType } from '../productModal';
import { onRemoveProducts } from '../../data/removeProducts';
import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseProductsScreenNavigationProp } from '../../navigation/types';
import { SelectedProductsList } from './SelectedProductsList';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

export const RemoveProductsScreen = memo(({ navigation }: Props) => {
  const store = useRef<Store>(removeProductsStore).current;

  const onCompleteRemove = useCallback(async () => {
    await onRemoveProducts(removeProductsStore);
  }, []);

  return (
    <BaseProductsScreen
      modalType={ProductModalType.Remove}
      navigation={navigation}
      store={store}
      onComplete={onCompleteRemove}
      ListComponent={SelectedProductsList}
    />
  );
});
