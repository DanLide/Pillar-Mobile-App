import React from 'react';
import { observer } from 'mobx-react';

import { BaseScannerScreen } from 'src/components';
import { ProductModal } from './components';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { useManageProducts } from 'src/modules/manageProducts/hooks';

const ScannerScreen = observer(() => {
  const {
    store,
    modalParams,
    product,
    onProductScan,
    onFetchProduct,
    onSubmit,
    onCloseModal,
    onEditPress,
    onCancelPress,
  } = useManageProducts();

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
    />
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
