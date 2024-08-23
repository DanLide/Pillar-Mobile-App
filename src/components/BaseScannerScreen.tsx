import { encode as btoa } from 'base-64';
import { observer } from 'mobx-react';
import { useCallback, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { View } from 'react-native';

import { BarcodeFormat } from 'vision-camera-code-scanner';
import { ToastType } from '../contexts/types';
import { fetchProductByScannedCode } from '../data/fetchProductByScannedCode';
import { BadRequestError, RequestError } from '../data/helpers/tryFetch';
import { Utils, isBadRequestError } from '../data/helpers/utils';
import { useSingleToast, useCustomGoBack } from 'src/hooks';
import {
  ProductModal,
  ProductModalParams,
  ProductModalProps,
  ProductQuantityToastType,
  ProductModalType,
} from 'src/modules/productModal';
import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../stores/types';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { ScanProduct, ScanProductProps } from './ScanProduct';
import { Spinner } from './Spinner';
import { ToastMessage } from './ToastMessage';
import { commonStyles } from 'src/theme';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';

import { useModal } from 'react-native-modalfy';
import { IModalStackParamsList } from 'src/types';

type StoreModel = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType &
  SyncedProductStoreType;

export enum ScannerScreenError {
  ProductNotFound = 'ProductNotFound',
  ProductNotAssignedToStock = 'ProductNotAssignedToStock',
  NetworkRequestFailed = 'NetworkRequestFailed',
  ProductIsNotRecoverable = 'ProductIsNotRecoverable',
}

interface Props {
  store: StoreModel;
  modalParams: ProductModalParams;
  product?: ProductModel;
  disableScanner?: boolean;
  disableAlert?: boolean;
  onProductScan?: (
    product: ProductModel,
    setIsScannerActive?: Dispatch<SetStateAction<boolean>>,
  ) => void;
  onSubmit?: (
    product: ProductModel,
    customToastType?: ProductQuantityToastType,
  ) => void | unknown;
  onEditPress?: () => void;
  onCancelPress?: () => void;
  onCloseModal?: () => void;
  onFetchProduct?: (
    code: string,
  ) => Promise<
    void | RequestError | ScannerScreenError.ProductIsNotRecoverable
  >;
  onBadRequestError?: (error: BadRequestError) => void;
  onChangeProductQuantity?: (qty?: number) => void;
  onProductsListPress?: () => void;
  ProductModalComponent?: React.FC<ProductModalProps>;
  filteredType?: BarcodeFormat;
  buttonListTitle?: string;
}

export const getScannerErrorMessages = (error: ScannerScreenError) => {
  const scannerErrorMessages: Record<ScannerScreenError, string> = {
    [ScannerScreenError.ProductNotFound]: i18n.t('productNotFoundOnDatabase'),
    [ScannerScreenError.ProductNotAssignedToStock]: i18n.t(
      'productNotAssignedToStock',
    ),
    [ScannerScreenError.NetworkRequestFailed]: i18n.t(
      'checkYourInternetConnection',
    ),
    [ScannerScreenError.ProductIsNotRecoverable]:
      i18n.t('cannotAddToInvoice') + '\n' + i18n.t('invoiceSettingsIncomplete'),
  };

  return scannerErrorMessages[error];
};

const getToastMessageInfoProductSubmit = (type: ProductModalType) => {
  const toastMessageInfoMap = new Map([
    [ProductModalType.Remove, i18n.t('addedToCart')],
    [ProductModalType.Return, i18n.t('addedToCart')],
    [ProductModalType.CreateInvoice, i18n.t('addedToInvoice')],
    [ProductModalType.CreateOrder, i18n.t('addedToOrder')],
    [ProductModalType.ReturnOrder, i18n.t('addedToOrder')],
  ]);

  return toastMessageInfoMap.get(type) ?? i18n.t('addedToList');
};

export const BaseScannerScreen: React.FC<Props> = observer(
  ({
    store,
    modalParams,
    product = store.getCurrentProduct,
    disableScanner,
    disableAlert,
    onProductScan,
    onSubmit,
    onEditPress,
    onCancelPress,
    onCloseModal,
    onFetchProduct,
    onBadRequestError,
    ProductModalComponent = ProductModal,
    onProductsListPress,
    filteredType,
    buttonListTitle,
  }) => {
    const { t } = useTranslation();
    const [isScannerActive, setIsScannerActive] = useState(true);
    const { showToast } = useSingleToast();
    const { openModal } = useModal<IModalStackParamsList>();
    const scannedProducts = store.getProducts;

    useCustomGoBack({
      callback: (event, navigation) => {
        if (!disableAlert && store.getNotSyncedProducts.length) {
          openModal('EraseProductModal', {
            onAction: () => store.setProducts([]),
          });
          return;
        }

        navigation.dispatch(event.data.action);
      },
      deps: [store.getNotSyncedProducts],
    });

    const handleScanError = useCallback(
      (
        error: ScannerScreenError | BadRequestError,
        toastType = ToastType.ScanError,
      ) => {
        setIsScannerActive(true);

        if (typeof error !== 'string') {
          return onBadRequestError?.(error);
        }

        return showToast(getScannerErrorMessages(error), {
          type: toastType,
        });
      },
      [onBadRequestError, showToast],
    );

    const handleFetchError = useCallback(
      (error: RequestError | ScannerScreenError.ProductIsNotRecoverable) => {
        if (
          error !== ScannerScreenError.ProductIsNotRecoverable &&
          Utils.isNetworkError(error)
        ) {
          return handleScanError?.(ScannerScreenError.NetworkRequestFailed);
        }

        if (error === ScannerScreenError.ProductIsNotRecoverable) {
          return handleScanError?.(
            ScannerScreenError.ProductIsNotRecoverable,
            ToastType.DetailedScanError,
          );
        }

        if (isBadRequestError(error) && error.error_description) {
          return handleScanError?.(error);
        }

        return handleScanError?.(ScannerScreenError.ProductNotFound);
      },
      [handleScanError],
    );

    const fetchProductByCode = useCallback(
      async (code: string) => {
        const fetchError = onFetchProduct
          ? await onFetchProduct(code)
          : await fetchProductByScannedCode(store, btoa(code));

        if (fetchError) return handleFetchError(fetchError);

        const product = store.getCurrentProduct;

        if (!product) {
          handleScanError?.(ScannerScreenError.ProductNotAssignedToStock);
          return;
        }

        onProductScan?.(product, setIsScannerActive);
      },
      [onFetchProduct, store, handleFetchError, onProductScan, handleScanError],
    );

    const onScanProduct = useCallback<ScanProductProps['onScan']>(
      async code => {
        setIsScannerActive(false);

        if (typeof code === 'string') {
          await fetchProductByCode(code);
        } else {
          handleScanError?.(ScannerScreenError.ProductNotFound);
        }
      },
      [fetchProductByCode, handleScanError],
    );

    const onProductSubmit = useCallback(
      (product: ProductModel, customToastType?: ProductQuantityToastType) => {
        if (onSubmit) {
          return onSubmit(product, customToastType);
        }

        const { nameDetails, reservedCount } = product;

        store.addProduct(product);

        showToast(
          <ToastMessage>
            <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
            {Number(reservedCount) > 1 ? t('units') : t('unit')} of{' '}
            <ToastMessage bold>
              {Utils.truncateString(nameDetails)}
            </ToastMessage>{' '}
            {getToastMessageInfoProductSubmit(modalParams.type)}
          </ToastMessage>,
          { type: ToastType.Info },
        );
      },
      [onSubmit, showToast, store, modalParams, t],
    );

    const setEditableProductQuantity = useCallback(
      (quantity: number) => {
        store.setEditableProductQuantity(quantity);
      },
      [store],
    );

    const handleCloseModal = () => {
      setIsScannerActive(true);
      setTimeout(() => {
        onCloseModal?.();
        store.removeCurrentProduct();
      }, 350);
    };

    const onSelectStock = (stock: StockModel) => {
      store.setCurrentStocks(stock);
    };

    return (
      <>
        <View style={commonStyles.flex1}>
          <InfoTitleBar
            type={InfoTitleBarType.Primary}
            title={store.currentStock?.organizationName}
          />
          <ScanProduct
            onScan={onScanProduct}
            isActive={!disableScanner && isScannerActive}
            scannedProductCount={scannedProducts.length}
            filteredType={filteredType}
            onProductsListPress={onProductsListPress}
            buttonListTitle={buttonListTitle}
          />
          <Spinner visible={!isScannerActive} />
          <ProductModalComponent
            {...modalParams}
            store={store}
            product={product}
            stockName={store.stockName}
            onSubmit={onProductSubmit}
            onEditPress={onEditPress}
            onCancelPress={onCancelPress}
            onClose={handleCloseModal}
            onChangeProductQuantity={setEditableProductQuantity}
            onSelectStock={onSelectStock}
          />
        </View>
      </>
    );
  },
);
