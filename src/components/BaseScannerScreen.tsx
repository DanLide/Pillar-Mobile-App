import React, { useCallback } from 'react';
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
  isScannerActive?: boolean;
  onScanStart?: () => void;
  onScanComplete?: () => void;
  onProduct?: (product: ProductModel) => void;
  onError?: (error: ScannerScreenError) => void;
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
    isScannerActive,
    onScanStart,
    onScanComplete,
    onProduct,
    onError,
  }) => {
    const scannedProducts = store.getProducts;

    const fetchProductByCode = useCallback(
      async (code: string) => {
        const networkError = await fetchProductByScannedCode(store, btoa(code));

        // TODO: Handle Network errors
        if (networkError) return onError?.(ScannerScreenError.ProductNotFound);

        const product = store.getCurrentProduct;

        if (!product)
          return onError?.(ScannerScreenError.ProductNotAssignedToStock);

        onProduct?.(product);
      },
      [store, onError, onProduct],
    );

    const onScanProduct = useCallback<ScanProductProps['onPressScan']>(
      async code => {
        onScanStart?.();
        trigger('selection', hapticOptions);
        scanMelody.play();

        if (typeof code === 'string') await fetchProductByCode(code);
        else onError?.(ScannerScreenError.ProductNotFound);

        onScanComplete?.();
      },
      [fetchProductByCode, onError, onScanComplete, onScanStart],
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
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});
