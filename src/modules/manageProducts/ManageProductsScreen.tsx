import React, { memo, useRef } from 'react';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseProductsScreen } from '../../components';
import { BaseProductsScreenNavigationProp } from '../../navigation/types';
import { ProductModalType } from '../productModal';
import { manageProductsStore } from './stores';
import { SelectedProductsList } from './components';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

type ProductStore = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

export const ManageProductsScreen = memo(({ navigation }: Props) => {
  const store = useRef<ProductStore>(manageProductsStore).current;

  return (
    <BaseProductsScreen
      hideCompleteButton
      modalType={ProductModalType.ManageProduct}
      navigation={navigation}
      store={store}
      tooltipTitle="Scan to find products"
      ListComponent={SelectedProductsList}
    />
  );
});
