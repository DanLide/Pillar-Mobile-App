import React, { memo, useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';

import { BaseProductsScreen } from 'src/components';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModalType } from '../productModal';
import { ProductModal, SelectedProductsList } from './components';
import { useManageProducts } from 'src/modules/manageProducts/hooks';
import { useBaseProductsScreen } from 'src/hooks';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ManageProductsScreen = memo(({ navigation }: Props) => {
  const {
    modalParams,
    store,
    product,
    onProductListItemPress,
    onCloseModal,
    onEditPress,
    onCancelPress,
    onSubmit,
  } = useManageProducts();

  const {
    scannedProductsCount,
    onPressScan,
    onRemoveProduct,
    setEditableProductQuantity,
  } = useBaseProductsScreen(store, navigation, ProductModalType.ManageProduct);

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
      disableAlert
      modalParams={modalParams}
      product={product}
      navigation={navigation}
      store={store}
      tooltipTitle="Scan to find products"
      primaryButtonTitle="Home"
      onComplete={handleHomePress}
      ProductModalComponent={ProductModal}
      ListComponent={SelectedProductsList}
      onProductListItemPress={onProductListItemPress}
      onCloseModal={onCloseModal}
      onPressScan={onPressScan}
      onRemoveProduct={onRemoveProduct}
      onSubmitProduct={onSubmit}
      scannedProductsCount={scannedProductsCount}
      setEditableProductQuantity={setEditableProductQuantity}
      onEditPress={onEditPress}
      onCancelPress={onCancelPress}
    />
  );
});
