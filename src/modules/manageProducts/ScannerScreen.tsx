import { useRef } from 'react';
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

const ScannerScreen = observer(() => {
  const { t } = useTranslation();
  const store = useRef(manageProductsStore).current;

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
      buttonListTitle={t('reviewUpdates')}
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
