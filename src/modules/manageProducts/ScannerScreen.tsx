import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { encode as btoa } from 'base-64';

import { BaseScannerScreen } from '../../components';
import { ProductModal } from './components';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
} from '../../stores/types';
import { ProductModalParams, ProductModalType } from '../productModal';
import { manageProductsStore } from './stores';
import { onUpdateProduct } from '../../data/updateProduct';
import { fetchProductDetails } from '../../data/fetchProductDetails';
import { ToastType } from '../../contexts/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { onUpdateProductQuantity } from '../../data/updateProductQuantity';
import { assoc, mergeLeft } from 'ramda';
import { useSingleToast } from '../../hooks';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
  isEdit: false,
  toastType: undefined,
};

const ScannerScreen = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<BaseProductsStore>(manageProductsStore).current;

  const { showToast } = useSingleToast();

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.ManageProduct,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const closeModal = useCallback(() => {
    setModalParams(initModalParams);
  }, []);

  const fetchProduct = useCallback(
    (code: string) => fetchProductDetails(store, btoa(code)),
    [store],
  );

  const updateProduct = useCallback(
    async (product: ProductModel) => {
      const updateProductFunction = modalParams.isEdit
        ? onUpdateProduct
        : onUpdateProductQuantity;

      const error = await updateProductFunction(manageProductsStore);

      if (error) {
        setModalParams(
          mergeLeft({
            toastType: ToastType.ProductUpdateError,
            onToastAction: () => updateProduct(product),
          }),
        );
        return error;
      }

      if (modalParams.isEdit) {
        setModalParams(
          mergeLeft({
            isEdit: false,
            toastType: ToastType.ProductUpdateSuccess,
          }),
        );
        return;
      }

      store.addProduct(product);

      showToast('Product Updated', { type: ToastType.ProductUpdateSuccess });
    },
    [modalParams.isEdit, showToast, store],
  );

  const handleEditPress = useCallback(() => {
    setModalParams(assoc('isEdit', true));
  }, []);

  const handleCancelPress = useCallback(() => {
    setModalParams(mergeLeft({ isEdit: false, toastType: undefined }));
  }, []);

  return (
    <BaseScannerScreen
      store={store}
      modalParams={modalParams}
      onProductScan={onProductScan}
      onFetchProduct={fetchProduct}
      onSubmit={updateProduct}
      onCloseModal={closeModal}
      onEditPress={handleEditPress}
      onCancelPress={handleCancelPress}
      ProductModalComponent={ProductModal}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
