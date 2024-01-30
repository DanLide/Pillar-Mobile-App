import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  memo,
  useEffect,
} from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SharedValue } from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

import { Modal } from 'src/components';
import {
  ProductQuantity,
  ProductQuantityToastType,
} from './components/quantityTab';
import { SelectProductJob } from './components/SelectProductJob';

import { SVGs, colors, fonts } from 'src/theme';
import { JobModel } from '../jobsList/stores/JobsStore';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ProductModel } from 'src/stores/types';
import { ToastType } from 'src/contexts/types';
import { StockLocationListModal } from '../orders/components';
import { StockModel } from '../stocksList/stores/StocksStore';
import { ordersStore } from '../orders/stores';

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
  value?: number;
  maxValue?: number;
  onHand?: number;
  toastType?: ProductQuantityToastType;
  minValue?: number;
}

export interface ProductModalProps extends ProductModalParams {
  product?: ProductModel;
  stockName?: string;
  isHideDecreaseButton?: boolean;

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: (product: ProductModel) => void;
  onEditPress?: () => void;
  onCancelPress?: () => void;
  onClose: () => void;
  onSubmit: (product: ProductModel) => void | unknown;
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
    case ProductModalType.Return:
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

export const ProductModal = memo(
  ({
    type,
    product,
    stockName,
    toastType,
    isEdit,
    value,
    maxValue = 0,
    minValue,
    onHand = 0,
    isHideDecreaseButton,
    onClose,
    onSubmit,
    onRemove,
    onChangeProductQuantity,
    onSelectStock,
  }: ProductModalProps) => {
    const tabs = useMemo(() => getTabs(type), [type]);
    const carouselRef = useRef<ICarouselInstance>(null);
    const [selectedTab, setSelectedTab] = useState<number>(tabs[0]);
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
        onSelectStock(stock);
        carouselRef.current?.next();
        ordersStore.setCurrentStocks(stock);
        setSelectedTab(tabs[1]);
      },
      [onSelectStock, tabs],
    );

    const renderItem = useCallback(
      ({ item }: { item: number }) => {
        const onPressAdd = (job?: JobModel) => {
          if (!product) return;

          onSubmit({ ...product, job });
          clearProductModalStoreOnClose();
        };

        const onPressSkip = () => {
          if (!product) return;

          onSubmit(product);
          clearProductModalStoreOnClose();
        };

        switch (item) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                type={type}
                product={product}
                onChangeProductQuantity={onChangeProductQuantity}
                isEdit={isEdit}
                disabled={toastType === ToastType.ProductQuantityError}
                jobSelectable={type === ProductModalType.Remove}
                toastType={toastType}
                value={value}
                maxValue={maxValue}
                minValue={minValue}
                style={styles.productQuantityContainer}
                onHand={onHand}
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
                isHideDecreaseButton={isHideDecreaseButton}
              />
            );
          case Tabs.LinkJob:
            return (
              <SelectProductJob
                isEdit={isEdit}
                productJob={product?.job}
                selectedTab={selectedTab}
                isRecoverableProduct={product?.isRecoverable}
                onPressSkip={onPressSkip}
                onPressBack={onPressBack}
                onPressAdd={onPressAdd}
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
        value,
        product,
        onSubmit,
        clearProductModalStoreOnClose,
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
        onSelectStockAndNavigateToEditQuantity,
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
                  ? product.nameDetails
                  : product?.product}
              </Text>
            );
          }
          return 'Adjust Quantity';
        }
        case Tabs.LinkJob:
          return 'Link to Repair Order';
        case Tabs.StockList:
          return (
            <View style={styles.upcContainer}>
              <SVGs.CodeIcon width={24} height={16} color={colors.black} />
              <Text style={styles.upcTitle}>UPC</Text>
              <Text style={styles.upc}>{product.upc}</Text>
            </View>
          );
        default:
          return '';
      }
    }, [selectedTab, type, product]);

    const renderStockName = useMemo(() => {
      switch (type) {
        case ProductModalType.ReceiveBackOrder:
          return 'Choose Stock Location for Item';
        default:
          return stockName;
      }
    }, [stockName, type]);

    return (
      <Modal
        isVisible={type !== ProductModalType.Hidden}
        onClose={clearProductModalStoreOnClose}
        title={renderStockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle={title}
      >
        <ToastContextProvider
          duration={0}
          offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}
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
        </ToastContextProvider>
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
