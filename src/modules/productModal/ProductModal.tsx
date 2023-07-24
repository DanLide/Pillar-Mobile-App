import React, { useCallback, useRef, useState, useMemo, memo } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Alert,
  NativeScrollEvent,
  ViewStyle,
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { Modal } from '../../components';
import { ProductQuantity } from './components/quantityTab';
import { SelectProductJob } from './components/SelectProductJob';

import { colors } from '../../theme';
import { JobModel } from '../jobsList/stores/JobsStore';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ProductModel } from '../../stores/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/default
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { Description } from './components/quantityTab/Description';

export enum ProductModalType {
  Remove,
  Return,
  CreateInvoice,
  ManageProduct,
  Hidden,
}

export interface ProductModalParams {
  type: ProductModalType;
  error?: string;
  isEdit?: boolean;
  maxValue?: number;
  onHand?: number;
}

interface Props extends ProductModalParams {
  product?: ProductModel;
  stockName?: string;

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

enum ScrollDirection {
  Down,
  Up,
}

const getTabs = (type: ProductModalType): Tabs[] => {
  switch (type) {
    case ProductModalType.Return:
    case ProductModalType.CreateInvoice:
      return [Tabs.EditQuantity];
    default:
      return [Tabs.EditQuantity, Tabs.LinkJob];
  }
};

const NAVIGATION_HEADER_HEIGHT = 64;
const MODAL_HEADER_HEIGHT = 70;

export const ProductModal = memo(
  ({
    type,
    product,
    stockName,
    error,
    isEdit,
    maxValue = 0,
    onHand = 0,
    onClose,
    onSubmit,
    onRemove,
    onChangeProductQuantity,
  }: Props) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const headerHeight = useHeaderHeight();

    const topOffset = useSharedValue(headerHeight);
    const descriptionShadowOpacity = useSharedValue(0);

    const { top: statusBarHeight } = useSafeAreaInsets();

    const tabs = useMemo(() => getTabs(type), [type]);

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
                type={type}
                product={product}
                onChangeProductQuantity={onChangeProductQuantity}
                isEdit={isEdit}
                jobSelectable={type === ProductModalType.Remove}
                error={error}
                maxValue={maxValue}
                onHand={onHand}
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
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
          default:
            return <View />;
        }
      },
      [
        product,
        onSubmit,
        clearProductModalStoreOnClose,
        onChangeProductQuantity,
        isEdit,
        type,
        error,
        maxValue,
        onHand,
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

    const getScrollDirection = useCallback((event: NativeScrollEvent) => {
      'worklet';
      return event.contentOffset.y > 0
        ? ScrollDirection.Up
        : ScrollDirection.Down;
    }, []);

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        topOffset.value = withSpring(destination, { damping: 50 });
      },
      [topOffset],
    );

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: event => {
        const scrollDirection = getScrollDirection(event);

        switch (scrollDirection) {
          case ScrollDirection.Up:
            scrollTo(headerHeight - statusBarHeight);
            break;
          case ScrollDirection.Down:
            scrollTo(headerHeight);
            break;
        }
      },
    });

    return (
      <Modal
        isVisible={type !== ProductModalType.Hidden}
        onClose={clearProductModalStoreOnClose}
        title={stockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle={title}
      >
        <ToastContextProvider
          duration={0}
          offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}
        >
          {type === ProductModalType.ManageProduct ? (
            <Animated.ScrollView
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              stickyHeaderIndices={[0]}
            >
              <Description product={product} topOffset={topOffset} />
              <ProductQuantity
                product={product}
                onChangeProductQuantity={onChangeProductQuantity}
                isEdit={isEdit}
                jobSelectable={false}
                error={error}
                maxValue={maxValue}
                onHand={onHand}
                onPressAddToList={console.log}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
              />
            </Animated.ScrollView>
          ) : (
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
          )}
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
