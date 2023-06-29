import React, { useState, useRef, useCallback } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { observer } from 'mobx-react';

import {
  ProductModal,
  ProductModalType,
  ProductModalParams,
} from '../productModal';
import {
  ToastMessage,
  BaseScannerScreen,
  ScannerScreenError,
  scannerErrorMessages,
} from '../../components';

import { removeProductsStore } from './stores';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ToastType } from '../../contexts/types';
import { Utils } from '../../data/helpers/utils';
import { getProductMinQty } from '../../data/helpers';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../../stores/types';

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

const ScannerScreen: React.FC = observer(() => {
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<StoreModel>(removeProductsStore).current;

  const toast = useToast();

  const onProduct = useCallback<(product: ProductModel) => Promise<void>>(
    async product => {
      const removedProductCount = store.getScannedProductsCountByProductId(
        product.productId,
      );

      const minQty = getProductMinQty(product.inventoryUseTypeId);

      const error =
        removedProductCount >= product.onHand || product.onHand < minQty
          ? "You cannot remove more products than are 'In Stock' in this stock location. You can update product quantity in Manage Products section"
          : undefined;

      setModalParams({
        type: ProductModalType.Add,
        error,
        maxValue: store.getMaxValue(product),
      });
    },
    [store],
  );

  const onScanStart = useCallback(() => setIsScannerActive(false), []);
  const onScanComplete = useCallback(() => setIsScannerActive(true), []);

  const onScanError = useCallback(
    (error: ScannerScreenError) =>
      toast.show(scannerErrorMessages[error], {
        type: ToastType.ScanError,
        duration: 0,
      }),
    [toast],
  );

  const onCloseModal = () => {
    setModalParams(initModalParams);
    store.removeCurrentProduct();
    setIsScannerActive(true);
  };

  const setEditableProductQuantity = (quantity: number) => {
    store.setEditableProductQuantity(quantity);
  };

  const onSubmitProduct = useCallback(
    (product: ProductModel) => {
      const { reservedCount, nameDetails } = product;

      store.addProduct(product);

      toast.show?.(
        <ToastMessage>
          <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
          {Number(reservedCount) > 1 ? 'units' : 'unit'} of{' '}
          <ToastMessage bold>{Utils.truncateString(nameDetails)}</ToastMessage>{' '}
          added to List
        </ToastMessage>,
        { type: ToastType.Info },
      );
    },
    [store, toast],
  );

  return (
    <>
      <BaseScannerScreen
        store={store}
        isScannerActive={isScannerActive}
        onScanStart={onScanStart}
        onScanComplete={onScanComplete}
        onProduct={onProduct}
        onError={onScanError}
      />
      <ProductModal
        {...modalParams}
        product={store.getCurrentProduct}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onChangeProductQuantity={setEditableProductQuantity}
      />
    </>
  );
});

export default () => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ScannerScreen />
  </ToastContextProvider>
);
