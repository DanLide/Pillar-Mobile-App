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
import { ScanProduct, ScanProductProps, ToastMessage } from '../../components';

import { fetchProduct } from '../../data/fetchProduct';

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

const hapticOptions = {
  enableVibrateFallback: true,
};

const ScannerScreen = () => {
  const store = useRef(scanningProductStore).current;

  const toast = useToast();

  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] = useState<ProductModalParams>({
    product: undefined,
    type: undefined,
  });

  const showProductNotFoundError = useCallback(
    () =>
      toast.show('This product cannot be found in our product database', {
        type: ToastType.ScanError,
      }),
    [toast],
  );

  const fetchProductByCode = useCallback(
    async (code: string) => {
      const error = await fetchProduct(scanningProductStore, btoa(code));

      if (error) return showProductNotFoundError();

      const product = store.getCurrentProduct;

      if (!product)
        return toast.show(
          'This product is not assigned to a this stock location',
          { type: ToastType.ScanError },
        );

      setModalParams({
        type: ProductModalType.Add,
        product: store.getCurrentProduct,
      });
    },
    [showProductNotFoundError, store.getCurrentProduct, toast],
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
    store.clear();
    setModalParams({
      type: undefined,
      product: undefined,
    });
    setIsScannerActive(true);
  };

  const onSubmitProduct = useCallback(
    (product: ScanningProductModel | RemoveProductModel) => {
      const { reservedCount, nameDetails } = product;

      removeProductsStore.addProduct(product);
      toast.show?.(
        <ToastMessage>
          <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
          {reservedCount > 1 ? 'units' : 'unit'} of{' '}
          <ToastMessage bold>{Utils.truncateString(nameDetails)}</ToastMessage>{' '}
          added to List
        </ToastMessage>,
        { type: ToastType.Info },
      );
    },
    [toast],
  );

  return (
    <View style={styles.container}>
      <ScanProduct onPressScan={onScanProduct} isActive={isScannerActive} />
      <ProductModal
        type={modalParams.type}
        product={modalParams.product}
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
