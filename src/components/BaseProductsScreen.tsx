import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgProps } from 'react-native-svg';
import { observer } from 'mobx-react';

import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../stores/types';
import {
  ProductModal,
  ProductModalParams,
  ProductModalProps,
  ProductModalType,
} from '../modules/productModal';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from '../navigation/types';
import { InfoTitleBar, InfoTitleBarType } from './InfoTitleBar';
import { TooltipBar } from './TooltipBar';
import Button, { ButtonType } from './Button';
import { colors, SVGs } from '../theme';
import EraseProductsAlert from 'src/modules/createInvoice/components/EraseProductsAlert';
import { RequestError } from 'src/data/helpers/tryFetch';
import { ToastType } from 'src/contexts/types';
import { useSingleToast, useCustomGoBack } from 'src/hooks';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { Flows } from 'src/modules/types';

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

interface SelectedProductsListProps {
  flow?: Flows;
  modalType?: ProductModalType;
  store?: Store;
  onEditProduct: (item: ProductModel) => void;
}

interface Props {
  store: Store;
  modalParams: ProductModalParams;
  flow: Flows;
  scannedProductsCount: number;
  navigation: BaseProductsScreenNavigationProp;
  tooltipTitle: string;
  ListComponent: React.FC<SelectedProductsListProps>;
  ProductModalComponent?: React.FC<ProductModalProps>;

  onPressScan: () => void;
  onProductListItemPress: (product: ProductModel) => void;
  onSubmitProduct: (product: ProductModel) => void;
  setEditableProductQuantity: (quantity: number) => void;
  onRemoveProduct: (product: ProductModel) => void;
  onCloseModal: () => void;

  product?: ProductModel;
  infoTitle?: string;
  primaryButtonTitle?: string;
  disableAlert?: boolean;
  completeErrorMessage?: string;

  onEditPress?: () => void;
  onCancelPress?: () => void;
  onComplete?: () => Promise<void | RequestError> | void;
}

const { width, height } = Dimensions.get('window');

const SCAN_ICON_PROPS: SvgProps = {
  height: 23.33,
  width: 32,
};

const BaseProducts = observer(
  ({
    modalParams,
    product,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
    onEditPress,
    onCancelPress,
    infoTitle,
    navigation,
    store,
    tooltipTitle,
    ListComponent,
    ProductModalComponent = ProductModal,
    primaryButtonTitle,
    disableAlert,
    onComplete,
    flow,
  }: Props) => {
    const { t } = useTranslation();
    const { showToast } = useSingleToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [eraseProductsAlertVisible, setEraseProductsAlertVisible] =
      useState(false);
    const isNeedNavigateBack = useRef(false);

    const modalType = modalParams.type;

    const scanButtonType =
      modalType === ProductModalType.ManageProduct && !scannedProductsCount
        ? ButtonType.primary
        : ButtonType.secondary;

    useCustomGoBack({
      callback: event => {
        if (!disableAlert && store.getNotSyncedProducts.length) {
          setEraseProductsAlertVisible(true);
          return;
        }

        navigation.dispatch(event.data.action);
      },
      deps: [store.getNotSyncedProducts],
    });

    const onCompleteRemove = useCallback(async () => {
      isNeedNavigateBack.current = true;

      setIsLoading(true);
      const error = await onComplete?.();
      setIsLoading(false);

      if (error && modalType === ProductModalType.CreateInvoice) {
        showToast(t('invoiceNotGenerated'), {
          type: ToastType.CreateInvoiceError,
          duration: 0,
          onPress: onCompleteRemove,
        });
        return;
      }

      if (modalType === ProductModalType.ManageProduct) return;

      navigation.reset({
        index: 0,
        routes: [
          {
            name: AppNavigator.ResultScreen,
            state: { routes: [{ name: AppNavigator.HomeStack }] },
          },
        ],
      });
    }, [modalType, navigation, onComplete, showToast]);

    const CompleteButton = useMemo<JSX.Element | null>(() => {
      if (
        modalType !== ProductModalType.ManageProduct ||
        (modalType === ProductModalType.ManageProduct && scannedProductsCount)
      ) {
        return (
          <Button
            disabled={!scannedProductsCount && flow !== Flows.ManageProduct}
            type={ButtonType.primary}
            buttonStyle={styles.buttonContainer}
            title={primaryButtonTitle ?? t('complete')}
            onPress={onCompleteRemove}
          />
        );
      }

      return null;
    }, [modalType, onCompleteRemove, primaryButtonTitle, scannedProductsCount]);

    return (
      <>
        <View style={styles.container}>
          <InfoTitleBar
            type={InfoTitleBarType.Primary}
            title={infoTitle || store.currentStock?.organizationName}
          />
          <TooltipBar title={tooltipTitle} />

          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.activityIndicator}
              />
            </View>
          ) : null}

          <ListComponent
            modalType={modalType}
            store={store}
            onEditProduct={onProductListItemPress}
            flow={flow}
          />

          <View style={styles.buttons}>
            <Button
              type={scanButtonType}
              icon={SVGs.CodeIcon}
              iconProps={SCAN_ICON_PROPS}
              textStyle={styles.scanText}
              buttonStyle={styles.buttonContainer}
              title={t('scan')}
              onPress={onPressScan}
            />

            {CompleteButton}
          </View>

          <ProductModalComponent
            {...modalParams}
            product={product}
            store={store}
            stockName={store.stockName}
            onSubmit={onSubmitProduct}
            onEditPress={onEditPress}
            onCancelPress={onCancelPress}
            onClose={onCloseModal}
            onRemove={onRemoveProduct}
            onChangeProductQuantity={setEditableProductQuantity}
          />
        </View>

        <EraseProductsAlert
          visible={eraseProductsAlertVisible}
          onPressPrimary={() => {
            store.setProducts([]);
            setEraseProductsAlertVisible(false);
          }}
          onPressSecondary={() => {
            setEraseProductsAlertVisible(false);
          }}
        />
      </>
    );
  },
);

export const BaseProductsScreen = (props: Props) => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <BaseProducts {...props} />
  </ToastContextProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    width,
    height,
    backgroundColor: colors.gray,
    top: 0,
    zIndex: 100,
    opacity: 0.6,
  },
  activityIndicator: {
    marginTop: height / 2 - 150,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  scanText: {
    paddingLeft: 8,
  },
  buttonContainer: {
    flex: 1,
    height: 48,
  },
});
