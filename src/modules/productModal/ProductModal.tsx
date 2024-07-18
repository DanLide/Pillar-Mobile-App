import { useCallback, useRef, useState, useMemo, memo, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SharedValue } from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import { isNil } from 'ramda';
import Toast from 'react-native-toast-notifications';
import ToastContainer from 'react-native-toast-notifications/lib/typescript/toast-container';

import { Modal } from 'src/components';
import {
  ProductQuantity,
  ProductQuantityToastType,
} from './components/quantityTab';
import { SelectProductJob } from './components/SelectProductJob';

import { SVGs, colors, fonts } from 'src/theme';
import { JobModel, jobIdNoRepairOrder } from '../jobsList/stores/JobsStore';
import { MODAL_TOAST_OFFSET_ABOVE_SINGLE_BUTTON } from 'src/contexts';
import {
  CurrentProductStoreType,
  ProductModel,
  ScannerModalStoreType,
  StockProductStoreType,
} from 'src/stores/types';
import { ToastType } from 'src/contexts/types';
import { StockLocationListModal } from '../orders/components';
import { StockModel } from '../stocksList/stores/StocksStore';
import { ordersStore } from '../orders/stores';
import { renderType } from 'src/contexts/ToastContext/renderTypes';

export enum ProductModalType {
  Remove,
  Return,
  CreateInvoice,
  ManageProduct,
  ReceiveOrder,
  CreateOrder,
  ReturnOrder,
  Hidden,
  ReceiveBackOrder,
}

export interface ProductModalParams {
  type: ProductModalType;
  isEdit?: boolean;
  maxValue?: number;
  onHand?: number;
  toastType?: ProductQuantityToastType;
  minValue?: number;
}

type BaseProductsStore = ScannerModalStoreType &
  CurrentProductStoreType &
  StockProductStoreType;

export interface ProductModalProps extends ProductModalParams {
  store?: BaseProductsStore;
  product?: ProductModel;
  stockName?: string;
  isHideDecreaseButton?: boolean;
  isAllowZeroValue?: boolean;

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: (product: ProductModel) => void;
  onEditPress?: () => void;
  onCancelPress?: () => void;
  onClose: () => void;
  onSubmit: (
    product: ProductModel,
    customToastType?: ProductQuantityToastType,
  ) => void | unknown;
  onSelectStock?: (stock: StockModel) => void;
}

const { width, height } = Dimensions.get('window');

export enum Tabs {
  EditQuantity,
  LinkJob,
  StockList,
}

const getTabs = (type: ProductModalType): Tabs[] => {
  switch (type) {
    case ProductModalType.CreateInvoice:
    case ProductModalType.ReceiveOrder:
    case ProductModalType.CreateOrder:
    case ProductModalType.ReturnOrder:
      return [Tabs.EditQuantity];
    case ProductModalType.ReceiveBackOrder:
      return [Tabs.StockList, Tabs.EditQuantity];
    default:
      return [Tabs.EditQuantity, Tabs.LinkJob];
  }
};

const MODAL_HEADER_HEIGHT = 70;
const TOAST_SUCCESS_CREATE_JOB = renderType[ToastType.SuccessCreateJob];

export const ProductModal = memo(
  ({
    type,
    store,
    product,
    stockName,
    toastType,
    isEdit,
    maxValue = 0,
    minValue,
    onHand = 0,
    isHideDecreaseButton,
    isAllowZeroValue,
    onClose,
    onSubmit,
    onRemove,
    onChangeProductQuantity,
    onSelectStock,
  }: ProductModalProps) => {
    const { t } = useTranslation();
    const tabs = useMemo(() => getTabs(type), [type]);
    const carouselRef = useRef<ICarouselInstance>(null);
    const [selectedTab, setSelectedTab] = useState<number>(tabs[0]);
    const [showProductModal, setShowProductModal] = useState<boolean>(true);
    const toastRef = useRef<ToastContainer>(null);

    useEffect(() => {
      setSelectedTab(tabs[0]);
    }, [tabs]);

    const headerHeight = useHeaderHeight();

    const topOffset = useMemo<SharedValue<number>>(
      () => ({ value: headerHeight }),
      [headerHeight],
    );

    const onJobSelectNavigation = useCallback(() => {
      setSelectedTab(Tabs.LinkJob);
      carouselRef.current?.next();
    }, []);

    const updateJobSelectModal = useCallback(
      (showModal: boolean, jobNumber?: string) => {
        if (jobNumber) {
          toastRef.current?.show(
            t('newJobNumberCreated', { number: jobNumber }),
            {
              style: [{ marginBottom: MODAL_TOAST_OFFSET_ABOVE_SINGLE_BUTTON }],
            },
          );
          setTimeout(() => {
            store?.setJobToCurrentProduct(jobNumber);
          }, 100);
        } else {
          setShowProductModal(showModal);
          setTimeout(() => {
            carouselRef.current?.next();
          });
        }
      },
      [],
    );

    const onPressBack = () => {
      setSelectedTab(Tabs.EditQuantity);
      carouselRef.current?.prev();
    };

    const clearProductModalStoreOnClose = useCallback(() => {
      setSelectedTab(0);
      onClose();
    }, [onClose]);

    const onRemoveAlert = useCallback(() => {
      if (product) onRemove?.(product);
      clearProductModalStoreOnClose();
    }, [clearProductModalStoreOnClose, product, onRemove]);

    const onSelectStockAndNavigateToEditQuantity = useCallback(
      async (stock: StockModel) => {
        onSelectStock?.(stock);
        carouselRef.current?.next();
        ordersStore.setCurrentStocks(stock);
        ordersStore.updateCurrentProductStock(stock);
        setSelectedTab(tabs[1]);
      },
      [onSelectStock, tabs],
    );

    const isReturnRemoveCreateInvoice =
      ProductModalType.Return ||
      type === ProductModalType.Remove ||
      type === ProductModalType.CreateInvoice;

    const renderItem = useCallback(
      ({ item }: { item: number }) => {
        const onPressAdd = (job?: JobModel) => {
          if (!product) return;

          if (job?.jobId === jobIdNoRepairOrder) {
            delete product.job;
            onSubmit(product);
          } else {
            let reservedCount = product.reservedCount;

            if (
              type === ProductModalType.Return &&
              !isNil(reservedCount) &&
              !isNil(job?.qty)
            ) {
              reservedCount =
                reservedCount > job?.qty ? job?.qty : reservedCount;
            }

            onSubmit({ ...product, job, reservedCount });
          }

          clearProductModalStoreOnClose();
        };

        const onPressSkip = () => {
          if (!product) return;

          onSubmit(product);
          clearProductModalStoreOnClose();
        };

        const productJobs =
          type === ProductModalType.Return &&
          product?.productId &&
          store?.productJobs
            ? store?.productJobs[product.productId]
            : [];

        switch (item) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                type={type}
                product={product}
                onChangeProductQuantity={onChangeProductQuantity}
                isEdit={isEdit}
                disabled={
                  toastType === ToastType.ProductQuantityError ||
                  toastType === ToastType.SpecialOrderError
                }
                jobSelectable={
                  type === ProductModalType.Remove ||
                  type === ProductModalType.Return
                }
                toastType={toastType}
                maxValue={maxValue}
                minValue={minValue}
                isAllowZeroValue={isAllowZeroValue}
                style={[
                  !isReturnRemoveCreateInvoice &&
                    styles.productQuantityContainer,
                ]}
                onHand={onHand}
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
                isHideDecreaseButton={isHideDecreaseButton}
                onClose={onClose}
              />
            );
          case Tabs.LinkJob:
            return (
              <SelectProductJob
                isEdit={isEdit}
                productJob={product?.job}
                productJobs={productJobs}
                selectedTab={selectedTab}
                isRecoverableProduct={product?.isRecoverable}
                onPressSkip={onPressSkip}
                onPressBack={onPressBack}
                onPressAdd={onPressAdd}
                updateJobSelectModal={updateJobSelectModal}
              />
            );
          case Tabs.StockList:
            return (
              <StockLocationListModal
                onSelectStock={onSelectStockAndNavigateToEditQuantity}
              />
            );
          default:
            return <View />;
        }
      },
      [
        product,
        onSubmit,
        clearProductModalStoreOnClose,
        isReturnRemoveCreateInvoice,
        type,
        onChangeProductQuantity,
        isEdit,
        toastType,
        maxValue,
        minValue,
        onHand,
        onJobSelectNavigation,
        onRemoveAlert,
        selectedTab,
        isHideDecreaseButton,
        isAllowZeroValue,
        onSelectStockAndNavigateToEditQuantity,
        onClose,
      ],
    );

    const title = useMemo<string | JSX.Element>(() => {
      switch (selectedTab) {
        case Tabs.EditQuantity: {
          if (
            type === ProductModalType.ReceiveOrder ||
            type === ProductModalType.CreateOrder ||
            type === ProductModalType.ReturnOrder ||
            type === ProductModalType.ReceiveBackOrder
          ) {
            return (
              <Text style={styles.title} ellipsizeMode="middle">
                {type === ProductModalType.ReceiveBackOrder
                  ? product?.nameDetails
                  : product?.product}
              </Text>
            );
          } else if (isReturnRemoveCreateInvoice) {
            return (
              <Text style={styles.title} ellipsizeMode="middle">{`${
                `${product?.manufactureCode} ` ?? ''
              }${product?.partNo ?? ''}`}</Text>
            );
          }
          return t('adjustQuantity');
        }
        case Tabs.LinkJob:
          return t('linkToRepairOrder');
        case Tabs.StockList:
          return (
            <View style={styles.upcContainer}>
              <SVGs.CodeIcon width={24} height={16} color={colors.black} />
              <Text style={styles.upcTitle}>{t('upc')}</Text>
              <Text style={styles.upc}>{product?.upc}</Text>
            </View>
          );
        default:
          return '';
      }
    }, [selectedTab, type, product, isReturnRemoveCreateInvoice, t]);

    const renderStockName = useMemo(() => {
      switch (type) {
        case ProductModalType.ReceiveBackOrder:
          return t('chooseStockLocationItem');
        default:
          return stockName;
      }
    }, [stockName, type, t]);

    return (
      <Modal
        isVisible={showProductModal && type !== ProductModalType.Hidden}
        onClose={clearProductModalStoreOnClose}
        title={renderStockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle={title}
      >
        <Carousel
          ref={carouselRef}
          loop={false}
          width={width}
          height={height - headerHeight - MODAL_HEADER_HEIGHT}
          autoPlay={false}
          enabled={false}
          data={tabs}
          scrollAnimationDuration={500}
          renderItem={renderItem}
        />
        <Toast ref={toastRef} renderToast={TOAST_SUCCESS_CREATE_JOB} />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
  productQuantityContainer: {
    paddingTop: 16,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.TT_Bold,
    lineHeight: 20,
    color: colors.grayDark3,
  },
  upcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcTitle: {
    fontSize: 17,
    fontFamily: fonts.TT_Bold,
    lineHeight: 20,
    paddingLeft: 8,
    paddingRight: 14,
  },
  upc: {
    fontSize: 17,
    fontFamily: fonts.TT_Regular,
    lineHeight: 25.5,
    color: colors.grayDark2,
  },
});
