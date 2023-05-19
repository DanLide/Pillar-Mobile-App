import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useToast } from 'react-native-toast-notifications';
import { encode as btoa } from 'base-64';

import { ProductModal } from '../productModal';
import { ScanProduct, ToastMessage } from '../../components';

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

export enum ModalType {
  Add,
  Edit,
}

interface ModalParams {
  type?: ModalType;
  product?: RemoveProductModel | ScanningProductModel;
}

const hapticOptions = {
  enableVibrateFallback: true,
};

const ScannerScreen = () => {
  const store = useRef(scanningProductStore).current;

  const toast = useToast();

  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] = useState<ModalParams>({
    product: undefined,
    type: undefined,
  });

  const fetchProductByCode = async (code: string) => {
    const error = await fetchProduct(scanningProductStore, btoa(code));

    if (error) {
      Alert.alert('Error', error.message || 'Loading is Failed!');
    } else {
      setModalParams({
        type: ModalType.Add,
        product: store.getCurrentProduct,
      });
    }
  };

  const onScanProduct = (data: string) => {
    setIsScannerActive(false);
    ReactNativeHapticFeedback.trigger('selection', hapticOptions);
    scanMelody.play();
    fetchProductByCode(data);
  };

  const onCloseModal = () => {
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
