import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/default
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { observer } from 'mobx-react';

import { Button, ButtonType, Modal } from '../../../components';
import {
  Description,
  ProductModalProps,
  ProductModalType,
} from '../../productModal';

import { colors } from '../../../theme';
import { ToastContextProvider } from '../../../contexts';
import { EditProduct } from './EditProduct';
import { manageProductsStore } from '../stores';
import { permissionProvider } from '../../../data/providers';
import { ViewProduct } from './ViewProduct';
import { ToastType } from '../../../contexts/types';

export enum ProductModalErrors {
  UpcUpdateError = 'UpcUpdateError',
  UpcLengthError = 'UpcLengthError',
  UpcFormatError = 'UpcFormatError',
}

enum ScrollDirection {
  Down,
  Up,
}

const SCROLL_ANIMATION_CONFIG: WithSpringConfig = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

const getErrorMessage = (error: unknown) => {
  switch (error) {
    case ProductModalErrors.UpcUpdateError:
    case ProductModalErrors.UpcFormatError:
      return 'Invalid UPC Code';
    case ProductModalErrors.UpcLengthError:
      return 'UPC length should be 12 or 13 digits long';
  }
};

export const ProductModal = observer(
  ({
    product,
    onHand,
    maxValue,
    type,
    stockName,
    toastType,
    isEdit,
    onSubmit,
    onEditPress,
    onCancelPress,
    onClose,
  }: ProductModalProps) => {
    const store = useRef(manageProductsStore).current;
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [upcError, setUpcError] = useState<string | undefined>();

    const modalCollapsedOffset = useHeaderHeight();
    const { top: modalExpandedOffset } = useSafeAreaInsets();

    const canEditProduct = permissionProvider.canEditProduct();

    const topOffset = useSharedValue(modalCollapsedOffset);

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        topOffset.value = withSpring(destination, SCROLL_ANIMATION_CONFIG);
      },
      [topOffset],
    );

    const clearProductModalStoreOnClose = useCallback(() => {
      scrollTo(modalCollapsedOffset);
      setUpcError(undefined);
      onCancelPress?.();
      onClose();
    }, [scrollTo, modalCollapsedOffset, onCancelPress, onClose]);

    const handleError = useCallback((error: unknown) => {
      switch (error) {
        case ProductModalErrors.UpcFormatError:
        case ProductModalErrors.UpcLengthError:
        case ProductModalErrors.UpcUpdateError:
          setUpcError(getErrorMessage(error));
          scrollViewRef.current?.scrollToEnd({ animated: true });
          break;
      }
    }, []);

    const handleSubmit = useCallback(async () => {
      if (!product) return;

      setIsLoading(true);
      const error = await onSubmit(product);
      setIsLoading(false);

      if (error) return handleError(error);

      if (!isEdit) clearProductModalStoreOnClose();
      else setUpcError(undefined);
    }, [clearProductModalStoreOnClose, handleError, isEdit, onSubmit, product]);

    const handleToastAction = useCallback(() => {
      switch (toastType) {
        case ToastType.ProductUpdateError:
          return handleSubmit();
        case ToastType.UpcUpdateError:
          onEditPress?.();
          break;
      }
    }, [handleSubmit, onEditPress, toastType]);

    const handleEdit = useCallback(() => {
      store.setUpdatedProduct(product);
      onEditPress?.();
    }, [onEditPress, product, store]);

    const handleCancel = useCallback(() => {
      setUpcError(undefined);
      onCancelPress?.();
    }, [onCancelPress]);

    const handleUpcChange = useCallback(() => {
      setUpcError(undefined);
    }, []);

    const setEditableProductQuantity = useCallback(
      (quantity: number) => {
        store.setEditableProductQuantity(quantity);
      },
      [store],
    );

    const scrollHandler = useAnimatedScrollHandler(
      {
        onScroll: event => {
          const scrollDirection =
            event.contentOffset.y > 0
              ? ScrollDirection.Up
              : ScrollDirection.Down;

          switch (scrollDirection) {
            case ScrollDirection.Up:
              scrollTo(modalExpandedOffset);
              break;
            case ScrollDirection.Down:
              scrollTo(modalCollapsedOffset);
              break;
          }
        },
      },
      [],
    );

    return (
      <Modal
        isVisible={type !== ProductModalType.Hidden}
        onClose={clearProductModalStoreOnClose}
        title={stockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle="View Product"
      >
        <ToastContextProvider disableSafeArea duration={0} offset={35}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={85}
            behavior="padding"
            style={styles.keyboardAvoidingView}
          >
            <Animated.ScrollView
              onScroll={scrollHandler}
              stickyHeaderIndices={[0]}
              contentContainerStyle={styles.contentContainer}
              bounces={false}
              ref={scrollViewRef}
              nestedScrollEnabled
            >
              <Description product={product} topOffset={topOffset} />
              <View style={styles.settings}>
                {isEdit ? (
                  <EditProduct
                    product={product}
                    onHand={onHand}
                    maxValue={maxValue}
                    toastType={toastType}
                    stockName={stockName}
                    upcError={upcError}
                    onUpcChange={handleUpcChange}
                    onToastAction={handleToastAction}
                  />
                ) : (
                  <ViewProduct
                    product={product}
                    onHand={onHand}
                    maxValue={maxValue}
                    toastType={toastType}
                    onToastAction={handleToastAction}
                    onChangeProductQuantity={setEditableProductQuantity}
                  />
                )}
              </View>
            </Animated.ScrollView>
            <View style={styles.buttons}>
              {canEditProduct && (
                <Button
                  title={isEdit ? 'Cancel' : 'Edit'}
                  type={ButtonType.secondary}
                  disabled={isLoading}
                  buttonStyle={styles.buttonContainer}
                  onPress={isEdit ? handleCancel : handleEdit}
                />
              )}
              <Button
                title={isEdit ? 'Save' : 'Done'}
                type={ButtonType.primary}
                isLoading={isLoading}
                buttonStyle={styles.buttonContainer}
                onPress={handleSubmit}
              />
            </View>
          </KeyboardAvoidingView>
        </ToastContextProvider>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    height: 48,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  contentContainer: {
    gap: 24,
    paddingBottom: 56,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  settings: {
    alignItems: 'center',
    gap: 24,
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
});
