import { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';

import { ProductModalType, ProductModalParams } from '../productModal';
import { BaseScannerScreen } from '../../components';

import { removeProductsStore } from './stores';

import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { getProductStepQty } from '../../data/helpers';
import {
  ScannerModalStoreType,
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../../stores/types';
import { ToastType } from '../../contexts/types';
import { InventoryUseType } from 'src/constants/common.enum';

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

      const minQty = getProductStepQty(product.inventoryUseTypeId);

      const calculateToastType = () => {
        const quantityError =
          removedProductCount >= product.onHand || product.onHand < minQty;

        if (!quantityError) {
          return undefined;
        }

        const isSpecialOrder =
          product?.inventoryUseTypeId === InventoryUseType.NonStock;

        return isSpecialOrder
          ? ToastType.SpecialOrderError
          : ToastType.ProductQuantityError;
      };

      const toastType = calculateToastType();

      setModalParams({
        type: ProductModalType.Remove,
        toastType,
        maxValue: store.getMaxValue(product),
        onHand: store.getOnHand(product),
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
