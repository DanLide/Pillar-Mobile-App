import { useCallback, useState } from 'react';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from 'src/stores/types';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModalParams, ProductModalType } from 'src/modules/productModal';

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const useBaseProductsScreen = (
  store: Store,
  navigation: BaseProductsScreenNavigationProp,
  type?: ProductModalType,
  backorder?: boolean,
) => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const product = store.getCurrentProduct;
  const scannedProductsCount = Object.keys(store.getProducts).length;

  const onPressScan = useCallback(async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.ScannerScreen,
        modalType: type,
      });
      return;
    }
    navigation.navigate(
      backorder
        ? AppNavigator.BackorderScannerScreen
        : AppNavigator.ScannerScreen,
      { modalType: type },
    );
  }, [navigation, backorder, type]);

  const onProductListItemPress = useCallback(
    (product: ProductModel) => {
      store.setCurrentProduct(product);
      setModalParams({
        isEdit: true,
        maxValue: store.getEditableMaxValue(product),
        onHand: store.getEditableOnHand(product),
        type: type ?? ProductModalType.CreateOrder,
      });
    },
    [store, type],
  );

  const onSubmitProduct = useCallback(
    (product: ProductModel) => store.updateProduct(product),
    [store],
  );

  const setEditableProductQuantity = useCallback(
    (quantity: number) => store.setEditableProductQuantity(quantity),
    [store],
  );

  const onRemoveProduct = useCallback(
    (product: ProductModel) => store.removeProduct(product),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  return {
    modalParams,
    product,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  };
};
