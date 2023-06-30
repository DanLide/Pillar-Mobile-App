import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HapticOptions, trigger } from 'react-native-haptic-feedback';
import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
} from '../stores/types';
import { fetchProductByScannedCode } from '../data/fetchProductByScannedCode';
import { ProductModal, ProductModalParams } from '../modules/productModal';
import ScanProduct, { ScanProductProps } from './ScanProduct';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { scanMelody } from './Sound';

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
  onScanError?: (error: ScannerScreenError) => void;
  onProductSubmit?: (product: ProductModel) => void;
  onCloseModal?: () => void;
}

export const scannerErrorMessages: Record<ScannerScreenError, string> = {
  [ScannerScreenError.ProductNotFound]:
    'This product cannot be found in our product database',
  [ScannerScreenError.ProductNotAssignedToStock]:
    'This product is not assigned to a this stock location',
};

const hapticOptions: HapticOptions = {
  enableVibrateFallback: true,
};

export const BaseScannerScreen: React.FC<Props> = observer(
  ({
    store,
    modalParams,
    onProductScan,
    onScanError,
    onProductSubmit,
    onCloseModal,
  }) => {
    const [isScannerActive, setIsScannerActive] = useState(true);

    const scannedProducts = store.getProducts;

    const fetchProductByCode = useCallback(
      async (code: string) => {
        const networkError = await fetchProductByScannedCode(store, btoa(code));

        // TODO: Handle Network errors
        if (networkError)
          return onScanError?.(ScannerScreenError.ProductNotFound);

        const product = store.getCurrentProduct;

        if (!product)
          return onScanError?.(ScannerScreenError.ProductNotAssignedToStock);

        onProductScan?.(product);
      },
      [store, onScanError, onProductScan],
    );

    const onScanProduct = useCallback<ScanProductProps['onPressScan']>(
      async code => {
        setIsScannerActive(false);
        trigger('selection', hapticOptions);
        scanMelody.play();

        if (typeof code === 'string') await fetchProductByCode(code);
        else onScanError?.(ScannerScreenError.ProductNotFound);

        setIsScannerActive(true);
      },
      [fetchProductByCode, onScanError],
    );

    const handleCloseModal = useCallback(() => {
      onCloseModal?.();
      store.removeCurrentProduct();
      setIsScannerActive(true);
    }, [onCloseModal, store]);

    const setEditableProductQuantity = useCallback(
      (quantity: number) => {
        store.setEditableProductQuantity(quantity);
      },
      [store],
    );

    const handleProductSubmit = useCallback(
      (product: ProductModel) => {
        store.addProduct(product);

        onProductSubmit?.(product);
      },
      [onProductSubmit, store],
    );

    return (
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Primary}
          title={store.currentStock?.organizationName}
        />
        <ScanProduct
          onPressScan={onScanProduct}
          isActive={isScannerActive}
          scannedProductCount={scannedProducts.length}
        />
        <ProductModal
          {...modalParams}
          product={store.getCurrentProduct}
          stockName={store.stockName}
          onSubmit={handleProductSubmit}
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
