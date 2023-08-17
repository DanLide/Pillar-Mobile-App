import React, { memo, useCallback, useRef } from 'react';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseProductsScreen } from '../../components';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from '../../navigation/types';
import { ProductModalType } from '../productModal';
import { manageProductsStore } from './stores';
import { SelectedProductsList } from './components';
import { CommonActions } from '@react-navigation/native';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

type ProductStore = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

export const ManageProductsScreen = memo(({ navigation }: Props) => {
  const store = useRef<ProductStore>(manageProductsStore).current;

  const handleHomePress = useCallback(
    () =>
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: AppNavigator.HomeStack }],
        }),
      ),
    [navigation],
  );

  return (
    <BaseProductsScreen
      modalType={ProductModalType.ManageProduct}
      navigation={navigation}
      store={store}
      tooltipTitle="Scan to find products"
      primaryButtonTitle="Home"
      onComplete={handleHomePress}
      ListComponent={SelectedProductsList}
    />
  );
});
