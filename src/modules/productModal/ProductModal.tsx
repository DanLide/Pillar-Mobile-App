import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { StyleSheet, Dimensions, View, Alert } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { observer } from 'mobx-react';

import { ScanningProductModel } from '../removeProducts/stores/ScanningProductStore';

import { Modal } from '../../components';
import { ProductQuantity } from './components/quantityTab';
import { SelectProductJob } from './components/SelectProductJob';

import { colors } from '../../theme';
import { productModalStore } from './store';
import { removeProductsStore } from '../removeProducts/stores';
import { RemoveProductModel } from '../removeProducts/stores/RemoveProductsStore';
import { JobModel } from '../jobsList/stores/JobsStore';
import { isRemoveProductModel } from '../removeProducts/helpers';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';

export enum ProductModalType {
  Add,
  Edit,
}

export interface ProductModalParams {
  type?: ProductModalType;
  product?: RemoveProductModel | ScanningProductModel;
  error?: string;
  selectedProductsReservedCount?: number;
}

interface Props extends ProductModalParams {
  onRemove?: (product: RemoveProductModel) => void;
  onClose: () => void;
  onSubmit: (product: ScanningProductModel) => void;
}

const { width, height } = Dimensions.get('window');

export enum Tabs {
  EditQuantity,
  LinkJob,
}

const tabs = [Tabs.EditQuantity, Tabs.LinkJob];

const NAVIGATION_HEADER_HEIGHT = 64;
const MODAL_HEADER_HEIGHT = 55;

export const ProductModal: React.FC<Props> = observer(
  ({
    type,
    product,
    error,
    selectedProductsReservedCount,
    onClose,
    onSubmit,
    onRemove,
  }) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const store = useRef(productModalStore).current;
    console.log(selectedProductsReservedCount, 'selectedProductsReservedCount');
    console.log(product, 'product');
    const balanceOfProducts =
      typeof selectedProductsReservedCount === 'number' && product
        ? product.onHand - selectedProductsReservedCount
        : 0;

    // We can add extra number of balanceOfProducts count to the current editable count
    const maxValue =
      type === ProductModalType.Edit
        ? balanceOfProducts + (product?.reservedCount || 0)
        : balanceOfProducts;

    const [selectedTab, setSelectedTab] = useState<number>(0);

    const productFromStore = store.getProduct;

    useEffect(() => {
      if (product) {
        store.setProduct(product);
      }
    }, [product, selectedProductsReservedCount, store, type]);

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
      Alert.alert('Remove confirmation', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            if (onRemove && isRemoveProductModel(productFromStore))
              onRemove(productFromStore);
            clearProductModalStoreOnClose();
          },
        },
      ]);
    }, [clearProductModalStoreOnClose, onRemove, productFromStore]);

    const renderItem = useCallback(
      ({ index }: { index: number }) => {
        const onPressAdd = (job?: JobModel) => {
          if (productFromStore) {
            onSubmit({ ...productFromStore, job });
            clearProductModalStoreOnClose();
          }
        };

        const onPressSkip = () => {
          if (productFromStore) {
            onSubmit(productFromStore);
            clearProductModalStoreOnClose();
          }
        };

        switch (index) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                isEdit={type === ProductModalType.Edit}
                error={error}
                maxValue={maxValue}
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
              />
            );
          case Tabs.LinkJob:
            return (
              <SelectProductJob
                isEdit={type === ProductModalType.Edit}
                productJob={productFromStore?.job}
                selectedTab={selectedTab}
                isRecoverableProduct={productFromStore?.isRecoverable}
                onPressSkip={onPressSkip}
                onPressBack={onPressBack}
                onPressAdd={onPressAdd}
              />
            );
          default:
            return <View />;
        }
      },
      [
        productFromStore,
        onSubmit,
        clearProductModalStoreOnClose,
        type,
        error,
        onJobSelectNavigation,
        onRemoveAlert,
        selectedTab,
      ],
    );

    const title = useMemo<string>(() => {
      switch (selectedTab) {
        case Tabs.EditQuantity:
          return 'Adjust Quantity';
        case Tabs.LinkJob:
          return 'Link to Job Number';
        default:
          return '';
      }
    }, [selectedTab]);

    return (
      <Modal
        isVisible={!!product}
        onClose={clearProductModalStoreOnClose}
        title={removeProductsStore.stockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={64}
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
            height={height - NAVIGATION_HEADER_HEIGHT - MODAL_HEADER_HEIGHT}
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
});
