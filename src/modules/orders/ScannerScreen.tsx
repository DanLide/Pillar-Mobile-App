import React, { useRef, useCallback, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';

import { BaseScannerScreen } from '../../components';
import { ProductModel } from '../../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { ordersStore } from './stores';
import AlertWrapper from '../../contexts/AlertWrapper';
import { BadRequestError } from '../../data/helpers/tryFetch';
import { colors, fonts, SVGs } from '../../theme';
import {
  getProductByOrderTypeAndSupplier,
  ProductByOrderTypeAndSupplierError,
} from '../../data/getProductByOrderTypeAndSupplier';

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

export const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [error, setError] = useState<BadRequestError | null>(null);

  const store = useRef(ordersStore).current;

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

  const fetchProduct = useCallback(
    async (code: string) => getProductByOrderTypeAndSupplier(store, code),
    [store],
  );

  const onBadRequestError = useCallback(
    (error: BadRequestError) => setError(error),
    [],
  );

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: ProductModalType.CreateOrder,
        maxValue: store.getMaxValue(),
        onHand: store.getOnHand(product),
      }),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  const closeAlert = useCallback(() => setError(null), []);

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
          store={store}
          modalParams={modalParams}
          disableScanner={!!error}
          onFetchProduct={fetchProduct}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          onBadRequestError={onBadRequestError}
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
