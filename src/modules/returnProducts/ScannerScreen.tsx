import React, { useRef, useCallback, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

import {
  BaseScannerScreen,
  scannerErrorMessages,
  ScannerScreenError,
  ToastMessage,
} from '../../components';

import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
  ProductModel,
} from '../../stores/types';
import { ToastType } from '../../contexts/types';
import { returnProductsStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { Utils } from '../../data/helpers/utils';
import { observer } from 'mobx-react';

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<StoreModel>(returnProductsStore).current;

  const toast = useToast();

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.Return,
        maxValue: store.getMaxValue(product),
      }),
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
