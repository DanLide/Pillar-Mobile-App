import React, { useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet } from 'react-native';
import { BaseScannerScreen } from '../../components';
import { ProductModel } from '../../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { ordersStore } from './stores';
import { BadRequestError } from '../../data/helpers/tryFetch';
import {
  getProductBySupplierWithStocks,
  ProductByOrderTypeAndSupplierError,
} from 'src/data/getProductBySupplierWithStocks';
import { StockLocationListModal } from './components/StockLocationListModal';
import AlertWrapper from 'src/contexts/AlertWrapper';
import { colors, fonts, SVGs } from '../../theme';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const getAlertTitle = (error?: string) => {
  switch (error) {
    case ProductByOrderTypeAndSupplierError.NotAssignedToDistributor:
      return 'Multiple Distributors';
    case ProductByOrderTypeAndSupplierError.NotAssignedToStock:
      return 'Multiple Stock Locations';
  }
};

export const BackOrderScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [error, setError] = useState<BadRequestError | null>(null);

  const fetchProduct = async (code: string) => getProductBySupplierWithStocks(ordersStore, code)

  const alertTitle = useMemo(() => {
    const title = getAlertTitle(error?.error);

    return (
      <View style={styles.alertTitleContainer}>
        <SVGs.CautionSolidIcon />
        <Text style={styles.alertTitle}>{title}</Text>
      </View>
    );
  }, [error?.error]);

  const alertMessage = useMemo(
    () => (
      <>
        <Text style={styles.alertMessage}>
          The code for the product you scanned is associated with{' '}
          <Text style={styles.alertMessageBold}>
            {error?.error_description}
          </Text>
        </Text>
        <Text style={styles.alertMessage}>
          <Text>• </Text> Try scanning a different code for this product
        </Text>
        <Text style={styles.alertMessage}>
          <Text>• </Text> Complete this order, and create a new order for{' '}
          <Text style={styles.alertMessageBold}>
            {error?.error_description}
          </Text>
        </Text>
      </>
    ),
    [error?.error_description],
  );

  const closeAlert = useCallback(() => setError(null), []);

  const onBadRequestError = (error: BadRequestError) => {
    setError(error)
  }

  const onProductScan = async (product: ProductModel) =>
    setModalParams({
      type: ProductModalType.ReceiveOrder,
      maxValue: ordersStore.getMaxValue(),
      onHand: ordersStore.getOnHand(product),
    })

  const onCloseModal = () => setModalParams(initModalParams);

  const onCloseSelectCabinetModal = () => {
    ordersStore.setCabinetSelection(false);
  };

  return (
    <AlertWrapper
      visible={!!error}
      message={alertMessage}
      title={alertTitle}
      primaryTitle="Okay"
      onPressPrimary={closeAlert}
      hideSecondary
      alertContainerStyle={styles.alertContainer}
    >
      <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
        <BaseScannerScreen
          store={ordersStore}
          modalParams={modalParams}
          disableScanner={!!error}
          onFetchProduct={fetchProduct}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          onBadRequestError={onBadRequestError}
        />
        <StockLocationListModal
          visible={ordersStore.cabinetSelection}
          closeModal={onCloseSelectCabinetModal}
        />
      </ToastContextProvider>
    </AlertWrapper>
  );
});

const styles = StyleSheet.create({
  alertContainer: {
    paddingTop: 32,
    gap: 24,
    alignItems: 'center',
  },
  alertTitle: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 17,
    lineHeight: 22,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  alertMessage: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    textAlign: 'center',
  },
  alertMessageBold: {
    fontFamily: fonts.TT_Bold,
  },
});