import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

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
import AlertWrapper from '../contexts/AlertWrapper';
import { RequestError } from 'src/data/helpers/tryFetch';
import { ToastType } from 'src/contexts/types';
import { useSingleToast } from 'src/hooks';
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

const alertMessage =
  'If you change the stock location now, all products added to this list will be deleted. \n\n Are you sure you want to continue?';

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
    const { showToast } = useSingleToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const isNeedNavigateBack = useRef(false);

    const modalType = modalParams.type;

    const scanButtonType =
      modalType === ProductModalType.ManageProduct && !scannedProductsCount
        ? ButtonType.primary
        : ButtonType.secondary;

    useEffect(() => {
      if (disableAlert) return;

      autorun(() => {
        navigation.addListener('beforeRemove', e => {
          if (!store.getNotSyncedProducts.length) {
            return;
          }
          if (isNeedNavigateBack.current) {
            setAlertVisible(false);
            return;
          }
          e.preventDefault();
          setAlertVisible(true);
        });
      });
    }, [
      navigation,
      alertVisible,
      store.getNotSyncedProducts.length,
      disableAlert,
    ]);

    const onCompleteRemove = useCallback(async () => {
      isNeedNavigateBack.current = true;

      setIsLoading(true);
      const error = await onComplete?.();
      setIsLoading(false);

      if (error && modalType === ProductModalType.CreateInvoice) {
        showToast('The Invoice was not generated. Please try again.', {
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

    const onPressPrimary = useCallback(() => {
      isNeedNavigateBack.current = true;
      navigation.goBack();
    }, [navigation]);

    const onPressSecondary = useCallback(() => setAlertVisible(false), []);

    const CompleteButton = useMemo<JSX.Element | null>(() => {
      if (
        modalType !== ProductModalType.ManageProduct ||
        (modalType === ProductModalType.ManageProduct && scannedProductsCount)
      ) {
        return (
          <Button
            disabled={!scannedProductsCount}
            type={ButtonType.primary}
            buttonStyle={styles.buttonContainer}
            title={primaryButtonTitle ?? 'Complete'}
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
              title="Scan"
              onPress={onPressScan}
            />

            {CompleteButton}
          </View>

          <ProductModalComponent
            {...modalParams}
            product={product}
            stockName={store.stockName}
            onSubmit={onSubmitProduct}
            onEditPress={onEditPress}
            onCancelPress={onCancelPress}
            onClose={onCloseModal}
            onRemove={onRemoveProduct}
            onChangeProductQuantity={setEditableProductQuantity}
          />
        </View>

        <AlertWrapper
          visible={alertVisible}
          message={alertMessage}
          title="Change Stock Location"
          onPressPrimary={onPressPrimary}
          onPressSecondary={onPressSecondary}
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
