import { useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import i18n from 'i18next';
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
import AlertWrapper from 'src/contexts/AlertWrapper';
import { colors, fonts, SVGs } from '../../theme';
import { getProductStepQty } from 'src/data/helpers';

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

export const BackOrderScannerScreen: React.FC = observer(() => {
  const { t } = useTranslation();
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);
  const [error, setError] = useState<BadRequestError | null>(null);

  const fetchProduct = async (code: string) =>
    getProductBySupplierWithStocks(ordersStore, code);

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

  const closeAlert = useCallback(() => setError(null), []);

  const onBadRequestError = (error: BadRequestError) => {
    setError(error);
  };

  const onCloseModal = () => setModalParams(initModalParams);

  const onProductScan = (product: ProductModel) => {
    const type = ordersStore.getCabinetSelection
      ? ProductModalType.ReceiveBackOrder
      : ProductModalType.ReceiveOrder;

    setModalParams({
      type,
      maxValue: ordersStore.getMaxValue(),
      minValue: getProductStepQty(product.inventoryUseTypeId),
    });
  };

  const onSubmit = (product: ProductModel) => {
    if (ordersStore.getProductByIdAndStorageId(product)) {
      ordersStore.updateProductByIdAndStorageId(product);
    } else {
      ordersStore.addBackOrderProduct(product);
    }
  };

  return (
    <>
      <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
        <BaseScannerScreen
          store={ordersStore}
          modalParams={modalParams}
          disableScanner={!!error}
          onFetchProduct={fetchProduct}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          onBadRequestError={onBadRequestError}
          onSubmit={onSubmit}
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
