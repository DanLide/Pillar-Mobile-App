import React, { useCallback, useRef, useState, useMemo } from 'react';
import { StyleSheet, Dimensions, View, Alert } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { observer } from 'mobx-react';

import { Modal } from '../../components';
import { ProductQuantity } from './components/quantityTab';
import { SelectProductJob } from './components/SelectProductJob';

import { colors } from '../../theme';
import { removeProductsStore } from '../removeProducts/stores';
import { JobModel } from '../jobsList/stores/JobsStore';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModel } from '../../stores/types';

export enum ProductModalType {
  Add,
  Edit,
  Hidden,
}
export interface ProductModalParams {
  type: ProductModalType;
  error?: string;
  maxValue?: number;
}

interface Props extends ProductModalParams {
  product?: ProductModel;

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: (product: ProductModel) => void;
  onClose: () => void;
  onSubmit: (product: ProductModel) => void;
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
    maxValue = 0,
    onClose,
    onSubmit,
    onRemove,
    onChangeProductQuantity,
  }) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);

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
            if (product) onRemove?.(product);
            clearProductModalStoreOnClose();
          },
        },
      ]);
    }, [clearProductModalStoreOnClose, product, onRemove]);

    const renderItem = useCallback(
      ({ index }: { index: number }) => {
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

        switch (index) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                product={product}
                onChangeProductQuantity={onChangeProductQuantity}
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
                productJob={product?.job}
                selectedTab={selectedTab}
                isRecoverableProduct={product?.isRecoverable}
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
        product,
        onSubmit,
        clearProductModalStoreOnClose,
        onChangeProductQuantity,
        type,
        error,
        maxValue,
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
        isVisible={type !== ProductModalType.Hidden}
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
