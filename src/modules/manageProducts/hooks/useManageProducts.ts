import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assoc, mergeLeft } from 'ramda';
import { encode as btoa } from 'base-64';
import { isValid } from 'gtin';

import { ProductModalErrors } from 'src/modules/manageProducts/components';
import { getIsUpcUnique } from 'src/modules/manageProducts/helpers';
import { stocksStore } from 'src/modules/stocksList/stores';
import { ToastType } from 'src/contexts/types';
import { ProductModel } from 'src/stores/types';
import { onUpdateProduct } from 'src/data/updateProduct';
import { onUpdateProductQuantity } from 'src/data/updateProductQuantity';
import {
  ManageProductsStore,
  manageProductsStore,
} from 'src/modules/manageProducts/stores';
import {
  ProductModalParams,
  ProductModalType,
  ProductQuantityToastType,
} from 'src/modules/productModal';
import { useSingleToast } from 'src/hooks';
import { fetchProductDetails } from 'src/data/fetchProductDetails';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
  isEdit: false,
  toastType: undefined,
};

export const useManageProducts = (store: ManageProductsStore) => {
  const { t } = useTranslation();
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const { showToast } = useSingleToast();

  const product = modalParams.isEdit
    ? store.updatedProduct
    : store.getCurrentProduct;

  const onProductScan = useCallback<(product: ProductModel) => void>(
    product =>
      setModalParams({
        type: ProductModalType.ManageProduct,
        maxValue: store.getMaxValue(),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onProductListItemPress = useCallback(
    (product: ProductModel) => {
      store.setCurrentProduct(product);
      onProductScan(product);
    },
    [onProductScan, store],
  );

  const onCloseModal = useCallback(() => {
    setModalParams(initModalParams);
    store.removeUpdatedProduct();
  }, [store]);

  const onFetchProduct = useCallback(
    (code: string) => fetchProductDetails(store, btoa(code)),
    [store],
  );

  const onEditPress = useCallback(() => {
    setModalParams(mergeLeft({ isEdit: true, toastType: undefined }));
    store.setUpdatedProduct(store.getCurrentProduct);
  }, [store]);

  const onCancelPress = useCallback(() => {
    setModalParams(mergeLeft({ isEdit: false, toastType: undefined }));
    store.setUpdatedProduct(store.getCurrentProduct);
  }, [store]);

  const validateUpc = useCallback(
    (upc?: string) => {
      if (!modalParams.isEdit || !upc || !store.isUpcChanged) return;

      const upcLengthValidation = [12, 13].includes(upc.length);

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

  const onSubmit = useCallback(
    async (product: ProductModel, customToast?: ProductQuantityToastType) => {
      if (customToast) {
        setModalParams(assoc('toastType', customToast));
        setTimeout(() => {
          // Workaround to drop the toast type, otherwise the toast will reappear on each render
          setModalParams(assoc('toastType', undefined));
        }, 0);
        return;
      }

      setModalParams(assoc('toastType', undefined));

      if (!store.isProductChanged) return;

      const upcValidationError = validateUpc(product.upc);

      if (upcValidationError) return upcValidationError;

      const updateProductFunction = modalParams.isEdit
        ? onUpdateProduct
        : onUpdateProductQuantity;

      const error = await updateProductFunction(manageProductsStore);

      if (error) {
        setModalParams(assoc('toastType', ToastType.ProductUpdateError));
        return error;
      }

      store.addProduct(product);

      if (modalParams.isEdit) {
        setModalParams(assoc('toastType', ToastType.ProductUpdateSuccess));
      } else {
        showToast(t('productUpdated'), {
          type: ToastType.ProductUpdateSuccess,
        });
      }
    },
    [modalParams.isEdit, showToast, store, t, validateUpc],
  );

  return {
    modalParams,
    store,
    product,
    onProductScan,
    onProductListItemPress,
    onCloseModal,
    onFetchProduct,
    onEditPress,
    onCancelPress,
    onSubmit,
  };
};
