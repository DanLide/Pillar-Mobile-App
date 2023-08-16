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
import {
  ProductModalParams,
  ProductModalType,
  ProductQuantityToastType,
} from '../productModal';
import { manageProductsStore } from './stores';
import { onUpdateProduct } from '../../data/updateProduct';
import { fetchProductDetails } from '../../data/fetchProductDetails';
import { useToast } from 'react-native-toast-notifications';
import { ToastType } from '../../contexts/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { onUpdateProductQuantity } from '../../data/updateProductQuantity';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const ScannerScreen = observer(() => {
  const [isEdit, setIsEdit] = useState(false);
  const [toastType, setToastType] = useState<
    ProductQuantityToastType | undefined
  >();

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

  const closeModal = useCallback(() => {
    setModalParams(initModalParams);
  }, []);

  const fetchProduct = useCallback(
    (code: string) => fetchProductDetails(store, btoa(code)),
    [store],
  );

  const updateProduct = useCallback(async () => {
    const updateProductFunction = isEdit
      ? onUpdateProduct
      : onUpdateProductQuantity;

    const error = await updateProductFunction(manageProductsStore);

    if (error) {
      setToastType(ToastType.ProductUpdateError);
      return error;
    }

    if (isEdit) {
      setIsEdit(false);
      setToastType(ToastType.ProductUpdateSuccess);
      return;
    }

    toast.show('Product Updated', { type: ToastType.ProductUpdateSuccess });
  }, [isEdit, toast]);

  const handleEditPress = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleCancelPress = useCallback(() => {
    setIsEdit(false);
    setToastType(undefined);
  }, []);

  return (
    <BaseScannerScreen
      store={store}
      modalParams={{ ...modalParams, isEdit, toastType }}
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
