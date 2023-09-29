import React, { useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';

import { BaseScannerScreen } from '../../components';

import { ProductModel } from '../../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { ordersStore } from './stores';
import { getProductByOrderTypeAndSupplier } from '../../data/getProductByOrderTypeAndSupplier';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef(ordersStore).current;

  const fetchProduct = useCallback(
    (code: string) => getProductByOrderTypeAndSupplier(store, code),
    [store],
  );

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.ReceiveOrder,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <BaseScannerScreen
        store={store}
        modalParams={modalParams}
        onFetchProduct={fetchProduct}
        onProductScan={onProductScan}
        onCloseModal={onCloseModal}
      />
    </ToastContextProvider>
  );
});
