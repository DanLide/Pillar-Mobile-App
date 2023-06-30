import React, { useState, useRef, useCallback } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { observer } from 'mobx-react';

import { ProductModalType, ProductModalParams } from '../productModal';
import {
  ToastMessage,
  BaseScannerScreen,
  ScannerScreenError,
  scannerErrorMessages,
} from '../../components';

import { removeProductsStore } from './stores';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ToastType } from '../../contexts/types';
import { Utils } from '../../data/helpers/utils';
import { getProductMinQty } from '../../data/helpers';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../../stores/types';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<StoreModel>(removeProductsStore).current;

  const toast = useToast();

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product => {
      const removedProductCount = store.getScannedProductsCountByProductId(
        product.productId,
      );

      const minQty = getProductMinQty(product.inventoryUseTypeId);

      const error =
        removedProductCount >= product.onHand || product.onHand < minQty
          ? "You cannot remove more products than are 'In Stock' in this stock location. You can update product quantity in Manage Products section"
          : undefined;

      setModalParams({
        type: ProductModalType.Add,
        error,
        maxValue: store.getMaxValue(product),
      });
    },
    [store],
  );

  const onScanError = useCallback(
    (error: ScannerScreenError) =>
      toast.show(scannerErrorMessages[error], {
        type: ToastType.ScanError,
        duration: 0,
      }),
    [toast],
  );

  const onProductSubmit = useCallback(
    ({ reservedCount, nameDetails }: ProductModel) =>
      toast.show?.(
        <ToastMessage>
          <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
          {Number(reservedCount) > 1 ? 'units' : 'unit'} of{' '}
          <ToastMessage bold>{Utils.truncateString(nameDetails)}</ToastMessage>{' '}
          added to List
        </ToastMessage>,
        { type: ToastType.Info },
      ),
    [toast],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  return (
    <BaseScannerScreen
      store={store}
      modalParams={modalParams}
      onProductScan={onProductScan}
      onScanError={onScanError}
      onProductSubmit={onProductSubmit}
      onCloseModal={onCloseModal}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
