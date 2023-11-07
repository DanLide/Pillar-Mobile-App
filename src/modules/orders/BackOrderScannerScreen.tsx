import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { BaseScannerScreen } from '../../components';
import { ProductModel } from '../../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { ordersStore } from './stores';
import { BadRequestError } from '../../data/helpers/tryFetch';
import { getProductBySupplierWithStocks } from 'src/data/getProductBySupplierWithStocks';
import { StockLocationListModal } from './components/StockLocationListModal';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const BackOrderScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [error, setError] = useState<BadRequestError | null>(null);

  const fetchProduct = async (code: string) => getProductBySupplierWithStocks(ordersStore, code)

  const onBadRequestError = (error: BadRequestError) => {
    setError(error)
  }

  const onProductScan = async (product: ProductModel) =>
    setModalParams({
      type: ProductModalType.ReceiveOrder,
      maxValue: ordersStore.getMaxValue(),
      onHand: ordersStore.getOnHand(product),
    })

  const onCloseModal = () => setModalParams(initModalParams);

  const onCloseSelectCabinetModal = () => {
    ordersStore.setCabinetSelection(false);
  };

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <BaseScannerScreen
        store={ordersStore}
        modalParams={modalParams}
        disableScanner={!!error}
        onFetchProduct={fetchProduct}
        onProductScan={onProductScan}
        onCloseModal={onCloseModal}
        onBadRequestError={onBadRequestError}
      />
      <StockLocationListModal
        visible={ordersStore.cabinetSelection}
        closeModal={onCloseSelectCabinetModal}
      />
    </ToastContextProvider>
  );
});
