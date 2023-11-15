import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
} from '../stores/types';
import { ToastType } from '../contexts/types';
import { fetchProductByScannedCode } from '../data/fetchProductByScannedCode';
import { isBadRequestError, Utils } from '../data/helpers/utils';
import {
  ProductModal,
  ProductModalParams,
  ProductModalProps,
} from '../modules/productModal';
import ScanProduct, { ScanProductProps } from './ScanProduct';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { ToastMessage } from './ToastMessage';
import { BadRequestError, RequestError } from '../data/helpers/tryFetch';
import { useSingleToast } from '../hooks';
import { BarcodeFormat } from 'vision-camera-code-scanner';

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

export enum ScannerScreenError {
  ProductNotFound = 'ProductNotFound',
  ProductNotAssignedToStock = 'ProductNotAssignedToStock',
  NetworkRequestFailed = 'NetworkRequestFailed',
  ProductIsNotRecoverable = 'ProductIsNotRecoverable',
}

interface Props {
  store: StoreModel;
  modalParams: ProductModalParams;
  product?: ProductModel;
  disableScanner?: boolean;
  onProductScan?: (product: ProductModel) => void;
  onSubmit?: (product: ProductModel) => void | unknown;
  onEditPress?: () => void;
  onCancelPress?: () => void;
  onCloseModal?: () => void;
  onFetchProduct?: (
    code: string,
  ) => Promise<
    void | RequestError | ScannerScreenError.ProductIsNotRecoverable
  >;
  onBadRequestError?: (error: BadRequestError) => void;
  ProductModalComponent?: React.FC<ProductModalProps>;
  filteredType?: BarcodeFormat;
}

export const scannerErrorMessages: Record<ScannerScreenError, string> = {
  [ScannerScreenError.ProductNotFound]:
    'This product cannot be found in our product database',
  [ScannerScreenError.ProductNotAssignedToStock]:
    'This product is not assigned to this stock location',
  [ScannerScreenError.NetworkRequestFailed]:
    'Please check your internet connection and retry',
  [ScannerScreenError.ProductIsNotRecoverable]:
    'Product should Recoverable for Create Invoice',
};

export const BaseScannerScreen: React.FC<Props> = observer(
  ({
    store,
    modalParams,
    product = store.getCurrentProduct,
    disableScanner,
    onProductScan,
    onSubmit,
    onEditPress,
    onCancelPress,
    onCloseModal,
    onFetchProduct,
    onBadRequestError,
    ProductModalComponent = ProductModal,
    filteredType,
  }) => {
    const [isScannerActive, setIsScannerActive] = useState(true);

    const { showToast } = useSingleToast();

    const scannedProducts = store.getProducts;

    const handleScanError = useCallback(
      (error: ScannerScreenError | BadRequestError) => {
        setIsScannerActive(true);

        if (typeof error !== 'string') {
          return onBadRequestError?.(error);
        }

        return showToast(scannerErrorMessages[error], {
          type: ToastType.ScanError,
          duration: 0,
        });
      },
      [onBadRequestError, showToast],
    );

    const handleFetchError = useCallback(
      (error: RequestError | ScannerScreenError.ProductIsNotRecoverable) => {
        if (
          error !== ScannerScreenError.ProductIsNotRecoverable &&
          Utils.isNetworkError(error)
        ) {
          return handleScanError?.(ScannerScreenError.NetworkRequestFailed);
        }

        if (error === ScannerScreenError.ProductIsNotRecoverable) {
          return handleScanError?.(ScannerScreenError.ProductIsNotRecoverable);
        }

        if (isBadRequestError(error) && error.error_description) {
          return handleScanError?.(error);
        }

        return handleScanError?.(ScannerScreenError.ProductNotFound);
      },
      [handleScanError],
    );

    const fetchProductByCode = useCallback(
      async (code: string) => {
        const fetchError = onFetchProduct
          ? await onFetchProduct(code)
          : await fetchProductByScannedCode(store, btoa(code));

        if (fetchError) return handleFetchError(fetchError);

        const product = store.getCurrentProduct;

        if (!product) {
          handleScanError?.(ScannerScreenError.ProductNotAssignedToStock);
          return;
        }

        onProductScan?.(product);
      },
      [onFetchProduct, store, handleFetchError, onProductScan, handleScanError],
    );

    const onScanProduct = useCallback<ScanProductProps['onScan']>(
      async code => {
        setIsScannerActive(false);

        if (typeof code === 'string') {
          await fetchProductByCode(code);
        } else {
          handleScanError?.(ScannerScreenError.ProductNotFound);
        }
      },
      [fetchProductByCode, handleScanError],
    );

    const onProductSubmit = useCallback(
      (product: ProductModel) => {
        if (onSubmit) {
          return onSubmit(product);
        }

        const { nameDetails, reservedCount } = product;

        store.addProduct(product);

        showToast(
          <ToastMessage>
            <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
            {Number(reservedCount) > 1 ? 'units' : 'unit'} of{' '}
            <ToastMessage bold>
              {Utils.truncateString(nameDetails)}
            </ToastMessage>{' '}
            added to List
          </ToastMessage>,
          { type: ToastType.Info },
        );
      },
      [onSubmit, showToast, store],
    );

    const setEditableProductQuantity = useCallback(
      (quantity: number) => {
        store.setEditableProductQuantity(quantity);
      },
      [store],
    );

    const handleCloseModal = () => {
      setIsScannerActive(true);
      setTimeout(() => {
        onCloseModal?.();
        store.removeCurrentProduct();
      }, 350);
    };

    return (
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Primary}
          title={store.currentStock?.organizationName}
        />
        <ScanProduct
          onScan={onScanProduct}
          isActive={!disableScanner && isScannerActive}
          scannedProductCount={scannedProducts.length}
          filteredType={filteredType}
        />
        <ProductModalComponent
          {...modalParams}
          product={product}
          stockName={store.stockName}
          onSubmit={onProductSubmit}
          onEditPress={onEditPress}
          onCancelPress={onCancelPress}
          onClose={handleCloseModal}
          onChangeProductQuantity={setEditableProductQuantity}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});
