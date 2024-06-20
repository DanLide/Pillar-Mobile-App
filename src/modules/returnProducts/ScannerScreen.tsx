import { useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { BaseScannerScreen } from '../../components';

import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  StockProductStoreType,
  ProductModel,
} from '../../stores/types';
import { returnProductsStore } from './stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModalParams, ProductModalType } from '../productModal';
import {
  AppNavigator,
  TReturnProductNavScreenProps,
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
  }: TReturnProductNavScreenProps<AppNavigator.ScannerScreen>) => {
    const { t } = useTranslation();
    const [modalParams, setModalParams] =
      useState<ProductModalParams>(initModalParams);

    const store = useRef<BaseProductsStore>(returnProductsStore).current;

    const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
      async product =>
        setModalParams({
          type: ProductModalType.Return,
          maxValue: store.getMaxValue(product),
          onHand: store.getOnHand(product),
        }),
      [store],
    );

    const onCloseModal = useCallback(() => setModalParams(initModalParams), []);
    const onProductListPress = useCallback(
      () => navigate(AppNavigator.ReturnProductsScreen),
      [navigate],
    );
    return (
      <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
        <BaseScannerScreen
          store={store}
          modalParams={modalParams}
          onProductScan={onProductScan}
          onCloseModal={onCloseModal}
          buttonListTitle={t('cart')}
          onProductsListPress={onProductListPress}
        />
      </ToastContextProvider>
    );
  },
);
