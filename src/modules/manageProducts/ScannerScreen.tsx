import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react';

import { BaseScannerScreen } from '../../components';

import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
  ProductModel,
} from '../../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { manageProductsStore } from './stores';
import { ProductModal } from './ProductModal';
import { onUpdateProduct } from '../../data/updateProduct';

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

  const store = useRef<BaseProductsStore>(manageProductsStore).current;

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.ManageProduct,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  const updateProduct = useCallback(
    () => onUpdateProduct(manageProductsStore),
    [],
  );

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <BaseScannerScreen
        fetchProductDetails
        store={store}
        modalParams={modalParams}
        onProductScan={onProductScan}
        onSubmit={updateProduct}
        onCloseModal={onCloseModal}
        ProductModalComponent={ProductModal}
      />
    </ToastContextProvider>
  );
});
