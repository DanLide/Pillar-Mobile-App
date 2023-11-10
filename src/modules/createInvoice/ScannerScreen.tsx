import React, { useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { ToastType } from 'src/contexts/types';
import { useSingleToast } from 'src/hooks';

import { BaseScannerScreen, ScannerScreenError } from '../../components';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
  ProductModel,
} from '../../stores/types';
import { createInvoiceStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { BadRequestError } from 'src/data/helpers/tryFetch';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const { showToast } = useSingleToast();

  const store = useRef<BaseProductsStore>(createInvoiceStore).current;

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.CreateInvoice,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  const onFetchProduct = async (code: string) => {
    const isProductRecoverable = (product?: ProductModel) =>
      product?.isRecoverable;

    const currentProduct = createInvoiceStore.getProductById(
      +code.replace('~~', ''),
    );

    if (!isProductRecoverable(currentProduct)) {
      return ScannerScreenError.ProductIsNotRecoverable;
    }

    store.setCurrentProduct(currentProduct);
  };

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <BaseScannerScreen
        store={store}
        modalParams={modalParams}
        onProductScan={onProductScan}
        onCloseModal={onCloseModal}
        onFetchProduct={onFetchProduct}
      />
    </ToastContextProvider>
  );
});
