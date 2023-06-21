import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import { useToast } from 'react-native-toast-notifications';
import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';

import {
  InfoTitleBar,
  ScanProduct,
  ScanProductProps,
  InfoTitleBarType,
} from '../../components';

import { fetchProductByScannedCode } from '../../data/fetchProductByScannedCode';

import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
} from '../../stores/types';
import { scanMelody } from '../../components/Sound';
import { ToastType } from '../../contexts/types';
import { returnProductsStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';

const hapticOptions = {
  enableVibrateFallback: true,
};

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const ScannerScreen: React.FC = observer(() => {
  const store = useRef<StoreModel>(returnProductsStore).current;

  const toast = useToast();

  const [isScannerActive, setIsScannerActive] = useState(true);

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
    },
    [store, showProductNotFoundError, toast],
  );

  const onScanProduct = useCallback<ScanProductProps['onPressScan']>(
    async code => {
      setIsScannerActive(false);
      trigger('selection', hapticOptions);
      scanMelody.play();

      if (typeof code === 'string') await fetchProductByCode(code);
      else showProductNotFoundError();

      setIsScannerActive(true);
    },
    [fetchProductByCode, showProductNotFoundError],
  );

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={store.currentStock?.organizationName}
      />
      <ScanProduct
        onPressScan={onScanProduct}
        isActive={isScannerActive}
        scannedProductCount={scannedProducts.length}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
