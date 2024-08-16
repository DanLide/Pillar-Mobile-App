import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import i18n from 'i18next';
import { BaseScannerScreen } from 'src/components';
import { ProductModel } from 'src/stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import { ordersStore } from './stores';
import AlertWrapper from '../../contexts/AlertWrapper';
import { BadRequestError } from 'src/data/helpers/tryFetch';
import { colors, fonts, SVGs } from '../../theme';
import {
  getProductByOrderTypeAndSupplier,
  ProductByOrderTypeAndSupplierError,
} from 'src/data/getProductByOrderTypeAndSupplier';
import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { OrderType } from 'src/constants/common.enum';

interface Props {
  route: RouteProp<OrdersParamsList, AppNavigator.ScannerScreen>;
}

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const getAlertTitle = (error?: string) => {
  switch (error) {
    case ProductByOrderTypeAndSupplierError.NotAssignedToDistributor:
      return i18n.t('multipleDistributors');
    case ProductByOrderTypeAndSupplierError.NotAssignedToStock:
      return i18n.t('multipleStockLocations');
  }
};

export const ScannerScreen = observer(({ route: { params } }: Props) => {
  const { t } = useTranslation();
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [error, setError] = useState<BadRequestError | null>(null);

  const store = useRef(ordersStore).current;

  const modalType = params?.modalType ?? ProductModalType.CreateOrder;

  const orderType =
    modalType === ProductModalType.CreateOrder
      ? OrderType.Purchase
      : OrderType.Return;

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
          {t('codeForProductAssociated')}{' '}
          <Text style={styles.alertMessageBold}>
            {error?.error_description}
          </Text>
        </Text>
        <Text style={styles.alertMessage}>
          <Text>• </Text> {t('tryScanningDifferentCodeProduct')}
        </Text>
        <Text style={styles.alertMessage}>
          <Text>• </Text> {t('completeOrderAndCeateNew')}{' '}
          <Text style={styles.alertMessageBold}>
            {error?.error_description}
          </Text>
        </Text>
      </>
    ),
    [error?.error_description, t],
  );

  const fetchProduct = useCallback(
    (code: string) => getProductByOrderTypeAndSupplier(store, code, orderType),
    [orderType, store],
  );

  const onBadRequestError = useCallback(
    (error: BadRequestError) => setError(error),
    [],
  );

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
    async product =>
      setModalParams({
        type: modalType,
        maxValue: store.getMaxValue(),
        onHand: store.getOnHand(product),
      }),
    [modalType, store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  const closeAlert = useCallback(() => setError(null), []);

  return (
    <>
      <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
        <BaseScannerScreen
          store={store}
          modalParams={modalParams}
          disableScanner={!!error}
          onFetchProduct={fetchProduct}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          onBadRequestError={onBadRequestError}
          buttonListTitle={t('reviewOrder')}
          disableAlert
        />
      </ToastContextProvider>

      <AlertWrapper
        visible={!!error}
        message={alertMessage}
        title={alertTitle}
        primaryTitle={t('okay')}
        onPressPrimary={closeAlert}
        hideSecondary
        alertContainerStyle={styles.alertContainer}
      />
    </>
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
