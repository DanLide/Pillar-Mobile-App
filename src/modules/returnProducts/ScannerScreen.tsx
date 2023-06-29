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
import {
  ProductModal,
  ProductModalParams,
  ProductModalType,
} from '../productModal';
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
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<StoreModel>(returnProductsStore).current;

  const toast = useToast();

  const onProduct = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.Return,
        maxValue: store.getMaxValue(product),
      }),
    [store],
  );

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
    <>
      <BaseScannerScreen
        store={store}
        isScannerActive={isScannerActive}
        onScanStart={onScanStart}
        onScanComplete={onScanComplete}
        onProduct={onProduct}
        onError={onScanError}
      />
      <ProductModal
        {...modalParams}
        product={store.getCurrentProduct}
        stockName={store.stockName}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onChangeProductQuantity={setEditableProductQuantity}
      />
    </>
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
