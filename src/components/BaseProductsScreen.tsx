import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
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

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

interface SelectedProductsListProps {
  onEditProduct: (item: ProductModel) => void;
}

interface Props {
  modalType: ProductModalType;
  navigation: BaseProductsScreenNavigationProp;
  store: Store;
  tooltipTitle: string;
  ListComponent: React.FC<SelectedProductsListProps>;
  hideCompleteButton?: boolean;
  onComplete?: () => Promise<void>;
}

const { width, height } = Dimensions.get('window');

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const alertMessage =
  'If you change the stock location now, all products added to this list will be deleted. \n\n Are you sure you want to continue?';

export const BaseProductsScreen = observer(
  ({
    modalType,
    navigation,
    store,
    tooltipTitle,
    ListComponent,
    hideCompleteButton,
    onComplete,
  }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalParams, setModalParams] =
      useState<ProductModalParams>(initModalParams);

    const [alertVisible, setAlertVisible] = useState(false);
    const isNeedNavigateBack = useRef(false);

    const scanButtonType = hideCompleteButton
      ? ButtonType.primary
      : ButtonType.secondary;

    const ScanIcon = useMemo(
      () => (
        <SVGs.CodeIcon
          color={hideCompleteButton ? colors.white : colors.purple}
          width={32}
          height={23.33}
        />
      ),
      [hideCompleteButton],
    );

    useEffect(() => {
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
    }, [navigation, alertVisible, store.getNotSyncedProducts.length]);

    const onPressScan = async () => {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      if (result !== RESULTS.GRANTED) {
        navigation.navigate(AppNavigator.CameraPermissionScreen, {
          nextRoute: AppNavigator.ScannerScreen,
        });
        return;
      }
      navigation.navigate(AppNavigator.ScannerScreen);
    };

    const onCompleteRemove = async () => {
      setIsLoading(true);
      await onComplete?.();
      setIsLoading(false);

      isNeedNavigateBack.current = true;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: AppNavigator.ResultScreen,
            state: { routes: [{ name: AppNavigator.HomeStack }] },
          },
        ],
      });
    };

    const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

    const onSubmitProduct = useCallback(
      (product: ProductModel) => store.updateProduct(product),
      [store],
    );

    const setEditableProductQuantity = useCallback(
      (quantity: number) => store.setEditableProductQuantity(quantity),
      [store],
    );

    const onEditProduct = useCallback(
      (product: ProductModel) => {
        store.setCurrentProduct(product);
        setModalParams({
          isEdit: true,
          maxValue: store.getEditableMaxValue(product),
          onHand: store.getEditableOnHand(product),
          type: modalType,
        });
      },
      [modalType, store],
    );

    const onRemoveProduct = useCallback(
      (product: ProductModel) => store.removeProduct(product),
      [store],
    );

    const onPressPrimary = useCallback(() => {
      isNeedNavigateBack.current = true;
      navigation.goBack();
    }, [navigation]);

    const onPressSecondary = useCallback(() => setAlertVisible(false), []);

    return (
      <AlertWrapper
        visible={alertVisible}
        message={alertMessage}
        title="Change Stock Location"
        onPressPrimary={onPressPrimary}
        onPressSecondary={onPressSecondary}
      >
        <View style={styles.container}>
          <InfoTitleBar
            type={InfoTitleBarType.Primary}
            title={store.currentStock?.organizationName}
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

          <ListComponent onEditProduct={onEditProduct} />

          <View style={styles.buttons}>
            <Button
              type={scanButtonType}
              icon={ScanIcon}
              textStyle={styles.scanText}
              buttonStyle={styles.buttonContainer}
              title="Scan"
              onPress={onPressScan}
            />

            {!hideCompleteButton && (
              <Button
                type={ButtonType.primary}
                disabled={!Object.keys(store.getProducts).length}
                buttonStyle={styles.buttonContainer}
                title="Complete"
                onPress={onCompleteRemove}
              />
            )}
          </View>

          <ProductModal
            {...modalParams}
            product={store.getCurrentProduct}
            stockName={store.stockName}
            onSubmit={onSubmitProduct}
            onClose={onCloseModal}
            onRemove={onRemoveProduct}
            onChangeProductQuantity={setEditableProductQuantity}
          />
        </View>
      </AlertWrapper>
    );
  },
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
    backgroundColor: 'gray',
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
