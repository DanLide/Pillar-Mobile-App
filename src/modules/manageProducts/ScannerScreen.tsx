import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { encode as btoa } from 'base-64';
import { isValid } from 'gtin';

import { BaseScannerScreen } from '../../components';
import { ProductModal, ProductModalErrors } from './components';

import { ProductModel } from '../../stores/types';
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
import { stocksStore } from '../stocksList/stores';
import { getIsUpcUnique } from './helpers';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
  isEdit: false,
  toastType: undefined,
};

const ScannerScreen = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef(manageProductsStore).current;

  const { showToast } = useSingleToast();

  const product = modalParams.isEdit
    ? store.updatedProduct
    : store.getCurrentProduct;

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.ManageProduct,
        maxValue: store.getMaxValue(),
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

  const handleEditPress = useCallback(() => {
    setModalParams(mergeLeft({ isEdit: true, toastType: undefined }));
  }, []);

  const handleCancelPress = useCallback(() => {
    setModalParams(mergeLeft({ isEdit: false, toastType: undefined }));
  }, []);

  const validateUpc = useCallback(
    (upc?: string) => {
      if (!modalParams.isEdit || !upc) return;

      const upcLengthValidation = !!upc && [12, 13].includes(upc.length);

      if (!upcLengthValidation) return ProductModalErrors.UpcLengthError;

      const isUpcValid = isValid(upc);

      if (!isUpcValid) return ProductModalErrors.UpcFormatError;

      const isUpcUnique = getIsUpcUnique(product)(stocksStore.facilityProducts);

      if (!isUpcUnique) {
        setModalParams(assoc('toastType', ToastType.UpcUpdateError));
        return ProductModalErrors.UpcUpdateError;
      }
    },
    [modalParams.isEdit, product],
  );

  const updateProduct = useCallback(
    async (product: ProductModel) => {
      setModalParams(assoc('toastType', undefined));

      const validationError = validateUpc(product.upc);

      if (validationError) return validationError;

      const updateProductFunction = modalParams.isEdit
        ? onUpdateProduct
        : onUpdateProductQuantity;

      const error = await updateProductFunction(manageProductsStore);

      if (error) {
        setModalParams(assoc('toastType', ToastType.ProductUpdateError));
        return error;
      }

      if (modalParams.isEdit) {
        handleCancelPress();
        setModalParams(assoc('toastType', ToastType.ProductUpdateSuccess));
        return;
      }

      store.addProduct(product);

      showToast('Product Updated', { type: ToastType.ProductUpdateSuccess });
    },
    [handleCancelPress, modalParams.isEdit, showToast, store, validateUpc],
  );

  return (
    <BaseScannerScreen
      store={store}
      modalParams={modalParams}
      product={product}
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
