import { useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';

import { BaseScannerScreen, ScannerScreenError, ToastActionType } from '../../components';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
  ProductModel,
} from '../../stores/types';
import { createInvoiceStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { BarcodeFormat } from 'vision-camera-code-scanner';
import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';
import { StyleSheet, Text } from 'react-native';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [alertParams, setAlertParams] = useState<AlertWrapperProps>()

  const store = useRef<BaseProductsStore>(createInvoiceStore).current;

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.CreateInvoice,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  const onFetchProduct = async (code: string) => {
    const isProductRecoverable = (product?: ProductModel) =>
      product?.isRecoverable;

    const currentProduct = createInvoiceStore.getProductById(
      +code.replace('~~', ''),
    );

    if (currentProduct && !isProductRecoverable(currentProduct)) {
      return ScannerScreenError.ProductIsNotRecoverable;
    }

    store.setCurrentProduct(currentProduct);
  };

  const handleToastPress = (actionType: ToastActionType) => {
    switch (actionType) {
      case ToastActionType.Details: {
        setAlertParams({
          visible: true,
          message: <Text style={{ textAlign: 'center' }}>Invoicing Settings for this product can be added at repairstack.3m.com > Products</Text>,
          onPressSecondary: () => {
            setAlertParams(undefined)
          }
        })
        break;
      }
      default: {
        return null
      }
    }
  }

  return (
    <>
      <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON} onPress={handleToastPress}>
        <BaseScannerScreen
          store={store}
          modalParams={modalParams}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          onFetchProduct={onFetchProduct}
          filteredType={BarcodeFormat.UPC_A}
        />
      </ToastContextProvider>

      <AlertWrapper
        visible={Boolean(alertParams)}
        message={alertParams?.message ?? ''}
        onPressSecondary={alertParams?.onPressSecondary}
        secondaryTitle='Close'
        hidePrimary
        alertContainerStyle={styles.alertContainer}
      />
    </>
  );
});

const styles = StyleSheet.create({
  alertContainer: {
    width: '70%'
  }
})
