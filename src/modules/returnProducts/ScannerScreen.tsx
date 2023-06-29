import React, { useRef, useCallback, memo, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

import {
  BaseScannerScreen,
  scannerErrorMessages,
  ScannerScreenError,
} from '../../components';

import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
} from '../../stores/types';
import { ToastType } from '../../contexts/types';
import { returnProductsStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const ScannerScreen: React.FC = memo(() => {
  const [isScannerActive, setIsScannerActive] = useState(true);

  const store = useRef<StoreModel>(returnProductsStore).current;

  const toast = useToast();

  const onScanStart = useCallback(() => setIsScannerActive(false), []);
  const onScanComplete = useCallback(() => setIsScannerActive(true), []);

  const onScanError = useCallback(
    (error: ScannerScreenError) =>
      toast.show(scannerErrorMessages[error], {
        type: ToastType.ScanError,
        duration: 0,
      }),
    [toast],
  );

  return (
    <BaseScannerScreen
      store={store}
      isScannerActive={isScannerActive}
      onScanStart={onScanStart}
      onScanComplete={onScanComplete}
      onError={onScanError}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
