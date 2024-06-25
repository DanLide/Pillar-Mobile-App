import { useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  BaseScannerScreen,
  ScannerScreenError,
  ToastActionType,
} from '../../components';
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
import {
  AppNavigator,
  TCreateInvoiceNavScreenProps,
} from 'src/navigation/types';

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const ScannerScreen = observer(
  ({
    navigation: { navigate },
  }: TCreateInvoiceNavScreenProps<AppNavigator.ScannerScreen>) => {
    const { t } = useTranslation();
    const [modalParams, setModalParams] =
      useState<ProductModalParams>(initModalParams);
    const [alertParams, setAlertParams] = useState<AlertWrapperProps>();

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

    const handleToastPress = (actionType: ToastActionType) => {
      switch (actionType) {
        case ToastActionType.Details: {
          setAlertParams({
            visible: true,
            message: (
              <Text style={styles.text}>
                {t('invoicingSettingsCanBeAddedAt')}
              </Text>
            ),
            onPressSecondary: () => {
              setAlertParams(undefined);
            },
          });
          break;
        }
        default: {
          return null;
        }
      }
    };

    const onProductListPress = useCallback(
      () => navigate(AppNavigator.CreateInvoiceProductsScreen),
      [navigate],
    );

    return (
      <>
        <ToastContextProvider
          offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}
          onPress={handleToastPress}
        >
          <BaseScannerScreen
            store={store}
            modalParams={modalParams}
            onProductScan={onProductScan}
            onCloseModal={onCloseModal}
            filteredType={BarcodeFormat.UPC_A}
            buttonListTitle={t('review')}
            onProductsListPress={onProductListPress}
          />
        </ToastContextProvider>

        <AlertWrapper
          visible={Boolean(alertParams)}
          message={alertParams?.message ?? ''}
          onPressSecondary={alertParams?.onPressSecondary}
          secondaryTitle={t('close')}
          hidePrimary
          alertContainerStyle={styles.alertContainer}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  alertContainer: {
    width: '70%',
  },
  text: { textAlign: 'center' },
});
