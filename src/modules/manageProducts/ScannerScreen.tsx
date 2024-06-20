import { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { BaseScannerScreen } from 'src/components';
import { ProductModal } from './components';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { useManageProducts } from 'src/modules/manageProducts/hooks';
import { manageProductsStore } from 'src/modules/manageProducts/stores';
import { useNavigation } from '@react-navigation/native';
import {
  AppNavigator,
  TManageProductsNavScreenProps,
} from 'src/navigation/types';

const ScannerScreen = observer(() => {
  const { t } = useTranslation();
  const store = useRef(manageProductsStore).current;
  const { navigate } =
    useNavigation<
      TManageProductsNavScreenProps<AppNavigator.ScannerScreen>['navigation']
    >();
  const {
    modalParams,
    product,
    onProductScan,
    onFetchProduct,
    onSubmit,
    onCloseModal,
    onEditPress,
    onCancelPress,
  } = useManageProducts(store);

  const onProductListPress = useCallback(
    () => navigate(AppNavigator.ManageProductsScreen),
    [navigate],
  );

  return (
    <BaseScannerScreen
      store={store}
      modalParams={modalParams}
      product={product}
      onProductScan={onProductScan}
      onFetchProduct={onFetchProduct}
      onSubmit={onSubmit}
      onCloseModal={onCloseModal}
      onEditPress={onEditPress}
      onCancelPress={onCancelPress}
      ProductModalComponent={ProductModal}
      onProductsListPress={onProductListPress}
      buttonListTitle={t('reviewUpdates')}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
