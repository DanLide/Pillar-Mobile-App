import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';
import { useToast } from 'react-native-toast-notifications';
import TrackPlayer from 'react-native-track-player';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
} from '../stores/types';
import { ToastType } from '../contexts/types';
import { fetchProductByScannedCode } from '../data/fetchProductByScannedCode';
import { Utils } from '../data/helpers/utils';
import { ProductModal, ProductModalParams } from '../modules/productModal';
import ScanProduct, { ScanProductProps } from './ScanProduct';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { ToastMessage } from './ToastMessage';
import { RequestError } from '../data/helpers/tryFetch';

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
  onProductScan?: (product: ProductModel) => void;
  onCloseModal?: () => void;
  onFetchProduct?: (code: string) => Promise<void | RequestError>;
}

export const scannerErrorMessages: Record<ScannerScreenError, string> = {
  [ScannerScreenError.ProductNotFound]:
    'This product cannot be found in our product database',
  [ScannerScreenError.ProductNotAssignedToStock]:
    'This product is not assigned to a this stock location',
};

export const BaseScannerScreen: React.FC<Props> = observer(
  ({ store, modalParams, onProductScan, onCloseModal, onFetchProduct }) => {
    const [isScannerActive, setIsScannerActive] = useState(true);

    const toast = useToast();

    const scannedProducts = store.getProducts;

    const onScanError = useCallback(
      (error: ScannerScreenError) =>
        toast.show(scannerErrorMessages[error], {
          type: ToastType.ScanError,
          duration: 0,
        }),
      [toast],
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

        if (!product)
          return onScanError?.(ScannerScreenError.ProductNotAssignedToStock);

        onProductScan?.(product);
      },
      [onFetchProduct, store, onScanError, onProductScan],
    );

    const onScanProduct = useCallback<ScanProductProps['onPressScan']>(
      async code => {
        setIsScannerActive(false);
        Vibration.vibrate();
        TrackPlayer.play();

        if (typeof code === 'string') await fetchProductByCode(code);
        else onScanError?.(ScannerScreenError.ProductNotFound);

        setIsScannerActive(true);
      },
      [fetchProductByCode, onScanError],
    );

    const onProductSubmit = useCallback(
      (product: ProductModel) => {
        const { nameDetails, reservedCount } = product;

        store.addProduct(product);

        toast.show?.(
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
      [store, toast],
    );

    const setEditableProductQuantity = useCallback(
      (quantity: number) => {
        store.setEditableProductQuantity(quantity);
      },
      [store],
    );

    const handleCloseModal = useCallback(() => {
      onCloseModal?.();
      store.removeCurrentProduct();
      setIsScannerActive(true);
    }, [onCloseModal, store]);

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
        <ProductModal
          {...modalParams}
          product={store.getCurrentProduct}
          stockName={store.stockName}
          onSubmit={onProductSubmit}
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
