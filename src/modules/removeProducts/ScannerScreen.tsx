import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useToast } from 'react-native-toast-notifications';
import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';

import {
  ProductModal,
  ProductModalType,
  ProductModalParams,
} from '../productModal';
import {
  InfoTitleBar,
  ScanProduct,
  ScanProductProps,
  ToastMessage,
  InfoTitleBarType,
} from '../../components';

import { fetchProductByScannedCode } from '../../data/fetchProductByScannedCode';

import { removeProductsStore } from './stores';

import { scanMelody } from '../../components/Sound';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
  ToastType,
} from '../../contexts';
import { Utils } from '../../data/helpers/utils';
import { getProductMinQty } from '../../data/helpers';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  ProductModel,
} from '../../stores/types';

const hapticOptions = {
  enableVibrateFallback: true,
};

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

type StoreModel = ScannerModalStoreType & CurrentProductStoreType;

const ScannerScreen = observer(() => {
  const store = useRef<StoreModel>(removeProductsStore).current;

  const toast = useToast();

  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const scannedProducts = store.getProducts;

  const showProductNotFoundError = useCallback(
    () =>
      toast.show('This product cannot be found in our product database', {
        type: ToastType.ScanError,
        duration: 0,
      }),
    [toast],
  );

  const fetchProductByCode = useCallback(
    async (code: string) => {
      const networkError = await fetchProductByScannedCode(store, btoa(code));

      // TODO: Handle Network errors
      if (networkError) return showProductNotFoundError();

      const product = store.getCurrentProduct;

      if (!product)
        return toast.show(
          'This product is not assigned to a this stock location',
          { type: ToastType.ScanError, duration: 0 },
        );

      const removedProductCount = store.getScannedProductsCountByProductId(
        product.productId,
      );

      const minQty = getProductMinQty(product.inventoryUseTypeId);

      const error =
        removedProductCount >= product.onHand || product.onHand < minQty
          ? "You cannot remove more products than are 'In Stock' in this stock location. You can update product quantity in Manage Products section"
          : undefined;

      // store.setCurrentProduct(product);
      setModalParams({
        type: ProductModalType.Add,
        error,
        maxValue: store.getMaxValue(product),
      });
    },
    [store, showProductNotFoundError, toast],
  );

  const onScanProduct = useCallback<ScanProductProps['onPressScan']>(
    async code => {
      setIsScannerActive(false);
      ReactNativeHapticFeedback.trigger('selection', hapticOptions);
      scanMelody.play();

      if (typeof code === 'string') await fetchProductByCode(code);
      else showProductNotFoundError();

      setIsScannerActive(true);
    },
    [fetchProductByCode, showProductNotFoundError],
  );

  const onCloseModal = () => {
    setModalParams(initModalParams);
    store.removeCurrentProduct();
    setIsScannerActive(true);
  };

  const setEditableProductQuantity = (quantity: number) => {
    store.setEditableProductQuantity(quantity);
  };

  const onSubmitProduct = useCallback(
    (product: ProductModel) => {
      const { reservedCount, nameDetails } = product;

      store.addProduct(product);

      toast.show?.(
        <ToastMessage>
          <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
          {Number(reservedCount) > 1 ? 'units' : 'unit'} of{' '}
          <ToastMessage bold>{Utils.truncateString(nameDetails)}</ToastMessage>{' '}
          added to List
        </ToastMessage>,
        { type: ToastType.Info },
      );
    },
    [store, toast],
  );

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={removeProductsStore.currentStock?.organizationName}
      />
      <ScanProduct
        onPressScan={onScanProduct}
        isActive={isScannerActive}
        scannedProductCount={scannedProducts.length}
      />
      <ProductModal
        {...modalParams}
        product={store.getCurrentProduct}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onChangeProductQuantity={setEditableProductQuantity}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
