import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useToast } from 'react-native-toast-notifications';
import { encode as btoa } from 'base-64';

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

import { RemoveProductModel } from './stores/RemoveProductsStore';
import { ScanningProductModel } from './stores/ScanningProductStore';

import { removeProductsStore, scanningProductStore } from './stores';

import { scanMelody } from '../../components/Sound';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
  ToastType,
} from '../../contexts';
import { Utils } from '../../data/helpers/utils';
import { getReservedCountById } from './helpers';
import { getProductMinQty } from '../../data/helpers';

const hapticOptions = {
  enableVibrateFallback: true,
};

const INIT_MODAL_PARAMS: ProductModalParams = {
  product: undefined,
  type: undefined,
};

const ScannerScreen = () => {
  const scannerStore = useRef(scanningProductStore).current;
  const removeStore = useRef(removeProductsStore).current;

  const toast = useToast();

  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(INIT_MODAL_PARAMS);

  const scannedProducts = removeStore.getProducts;

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
      const networkError = await fetchProductByScannedCode(
        scanningProductStore,
        btoa(code),
      );

      // TODO: Handle Network errors
      if (networkError) return showProductNotFoundError();

      const product = scannerStore.getCurrentProduct;

      if (!product)
        return toast.show(
          'This product is not assigned to a this stock location',
          { type: ToastType.ScanError, duration: 0 },
        );

      const removedProductCount = getReservedCountById(
        scannedProducts,
        product.productId,
      );

      const minQty = getProductMinQty(product.inventoryUseType);

      const error =
        removedProductCount >= product.onHand || product.onHand < minQty
          ? "You cannot remove more products than are 'In Stock' in this stock location. You can update product quantity in Manage Products section"
          : undefined;

      setModalParams({
        type: ProductModalType.Add,
        product,
        error,
        selectedProductsReservedCount: removedProductCount,
      });
    },
    [
      showProductNotFoundError,
      scannerStore.getCurrentProduct,
      toast,
      scannedProducts,
    ],
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
    scannerStore.clear();
    setModalParams(INIT_MODAL_PARAMS);
    setIsScannerActive(true);
  };

  const onSubmitProduct = useCallback(
    (product: ScanningProductModel | RemoveProductModel) => {
      const { reservedCount, nameDetails } = product;

      removeStore.addProduct(product);

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
    [removeStore, toast],
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
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
      />
    </View>
  );
};

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
