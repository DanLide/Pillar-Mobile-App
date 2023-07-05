import React, { memo, useCallback, useRef } from 'react';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseProductsScreen } from '../../components';
import { BaseProductsScreenNavigationProp } from '../../navigation/types';
import { returnProductsStore } from './stores';
import { ProductModalType } from '../productModal';
import { SelectedProductsList } from './components';
import { onReturnProducts } from '../../data/returnProducts';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

export const ReturnProductsScreen = memo(({ navigation }: Props) => {
  const store = useRef<Store>(returnProductsStore).current;

  const onCompleteRemove = useCallback(async () => {
    await onReturnProducts(returnProductsStore);
  }, []);

  return (
    <BaseProductsScreen
      modalType={ProductModalType.Return}
      navigation={navigation}
      store={store}
      onComplete={onCompleteRemove}
      ListComponent={SelectedProductsList}
    />
  );
});
