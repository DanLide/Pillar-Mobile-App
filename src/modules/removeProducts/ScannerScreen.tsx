import React, { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';

import { ProductModalType, ProductModalParams } from '../productModal';
import { BaseScannerScreen } from '../../components';

import { removeProductsStore } from './stores';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
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

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

export const ScannerScreen: React.FC = observer(() => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef<BaseProductsStore>(removeProductsStore).current;

  const onProductScan = useCallback<(product: ProductModel) => Promise<void>>(
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
        type: ProductModalType.Remove,
        error,
        maxValue: store.getMaxValue(product),
      });
    },
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

  return (
    <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
      <BaseScannerScreen
        store={store}
        modalParams={modalParams}
        onProductScan={onProductScan}
        onCloseModal={onCloseModal}
      />
    </ToastContextProvider>
  );
});
