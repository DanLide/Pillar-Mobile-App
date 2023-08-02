import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { encode as btoa } from 'base-64';

import { BaseScannerScreen } from '../../components';
import { ProductModal } from './components';

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
import { onUpdateProduct } from '../../data/updateProduct';
import { fetchProductDetails } from '../../data/fetchProductDetails';
import { useToast } from 'react-native-toast-notifications';
import { ToastType } from '../../contexts/types';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<BaseProductsStore>(manageProductsStore).current;

  const toast = useToast();

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.ManageProduct,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const closeModal = useCallback(() => setModalParams(initModalParams), []);

  const fetchProduct = useCallback(
    (code: string) => fetchProductDetails(store, btoa(code)),
    [store],
  );

  const updateProduct = useCallback(async () => {
    const error = await onUpdateProduct(manageProductsStore);

    if (error) {
      toast.show('Sorry, there was an issue saving the product update', {
        type: ToastType.Error,
      });
      return;
    }

    closeModal();
    toast.show('Product Updated', { type: ToastType.Success });
  }, [closeModal, toast]);

  return (
    <BaseScannerScreen
      store={store}
      modalParams={modalParams}
      onProductScan={onProductScan}
      onFetchProduct={fetchProduct}
      onSubmit={updateProduct}
      onCloseModal={closeModal}
      ProductModalComponent={ProductModal}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
