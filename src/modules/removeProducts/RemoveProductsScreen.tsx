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
import { useBaseProductsScreen } from 'src/hooks';

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

  const {
    modalParams,
    product,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(store, navigation, ProductModalType.Remove);

  return (
    <BaseProductsScreen
      modalParams={modalParams}
      product={product}
      scannedProductsCount={scannedProductsCount}
      onPressScan={onPressScan}
      onProductListItemPress={onProductListItemPress}
      onSubmitProduct={onSubmitProduct}
      setEditableProductQuantity={setEditableProductQuantity}
      onRemoveProduct={onRemoveProduct}
      onCloseModal={onCloseModal}
      navigation={navigation}
      store={store}
      tooltipTitle="Scan to add products to list"
      onComplete={onCompleteRemove}
      ListComponent={SelectedProductsList}
    />
  );
});
