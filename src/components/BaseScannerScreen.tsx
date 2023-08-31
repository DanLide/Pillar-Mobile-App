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
import { Utils } from '../data/helpers/utils';
import {
  ProductModal,
  ProductModalParams,
  ProductModalProps,
} from '../modules/productModal';
import ScanProduct, { ScanProductProps } from './ScanProduct';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { ToastMessage } from './ToastMessage';
import { RequestError } from '../data/helpers/tryFetch';
import { useSingleToast } from '../hooks';

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

export enum ScannerScreenError {
  ProductNotFound,
  ProductNotAssignedToStock,
}

interface Props {
  store: StoreModel;
  modalParams: ProductModalParams;
  product?: ProductModel;
  onProductScan?: (product: ProductModel) => void;
  onSubmit?: (product: ProductModel) => void | unknown;
  onEditPress?: () => void;
  onCancelPress?: () => void;
  onCloseModal?: () => void;
  onFetchProduct?: (code: string) => Promise<void | RequestError>;
  ProductModalComponent?: React.FC<ProductModalProps>;
}

export const scannerErrorMessages: Record<ScannerScreenError, string> = {
  [ScannerScreenError.ProductNotFound]:
    'This product cannot be found in our product database',
  [ScannerScreenError.ProductNotAssignedToStock]:
    'This product is not assigned to this stock location',
};

export const BaseScannerScreen: React.FC<Props> = observer(
  ({
    store,
    modalParams,
    product = store.getCurrentProduct,
    onProductScan,
    onSubmit,
    onEditPress,
    onCancelPress,
    onCloseModal,
    onFetchProduct,
    ProductModalComponent = ProductModal,
  }) => {
    const [isScannerActive, setIsScannerActive] = useState(true);

    const { showToast } = useSingleToast();

    const scannedProducts = store.getProducts;

    const onScanError = useCallback(
      (error: ScannerScreenError) => {
        setIsScannerActive(true);

        showToast(scannerErrorMessages[error], {
          type: ToastType.ScanError,
          duration: 0,
        });
      },
      [showToast],
    );

    const fetchProductByCode = useCallback(
      async (code: string) => {
        const networkError = onFetchProduct
          ? await onFetchProduct(code)
          : await fetchProductByScannedCode(store, btoa(code));

        // TODO: Handle Network errors
        if (networkError)
          return onScanError?.(ScannerScreenError.ProductNotFound);

        const product = store.getCurrentProduct;

        if (!product) {
          onScanError?.(ScannerScreenError.ProductNotAssignedToStock);
          return;
        }

        onProductScan?.(product);
      },
      [onFetchProduct, store, onScanError, onProductScan],
    );

    const onScanProduct = useCallback<ScanProductProps['onScan']>(
      async code => {
        setIsScannerActive(false);

        if (typeof code === 'string') {
          await fetchProductByCode(code);
        } else {
          onScanError?.(ScannerScreenError.ProductNotFound);
        }
      },
      [fetchProductByCode, onScanError],
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
          isActive={isScannerActive}
          scannedProductCount={scannedProducts.length}
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
