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

import { Button, ButtonType, Modal } from '../../../components';
import {
  Description,
  ProductModalProps,
  ProductModalType,
} from '../../productModal';

import { colors } from '../../../theme';
import { ToastContextProvider } from '../../../contexts';
import { observer } from 'mobx-react';
import { EditProduct } from './EditProduct';
import { manageProductsStore } from '../stores';
import { permissionProvider } from '../../../data/providers';
import { ViewProduct } from './ViewProduct';

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

export const ProductModal = observer(
  ({
    product,
    onHand,
    maxValue,
    type,
    stockName,
    toastType,
    onToastAction,
    isEdit,
    onSubmit,
    onEditPress,
    onCancelPress,
    onClose,
  }: ProductModalProps) => {
    const store = useRef(manageProductsStore).current;

    const [isLoading, setIsLoading] = useState(false);

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
      onCancelPress?.();
      onClose();
    }, [scrollTo, modalCollapsedOffset, onCancelPress, onClose]);

    const handleSubmit = useCallback(async () => {
      if (!product) return;

      setIsLoading(true);
      const error = await onSubmit(product);
      setIsLoading(false);

      if (!isEdit && !error) clearProductModalStoreOnClose();
    }, [clearProductModalStoreOnClose, isEdit, onSubmit, product]);

    const handleEdit = useCallback(() => {
      store.setUpdatedProduct(product);
      onEditPress?.();
    }, [onEditPress, product, store]);

    const handleCancel = useCallback(() => {
      onCancelPress?.();
    }, [onCancelPress]);

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
              nestedScrollEnabled
            >
              <Description product={product} topOffset={topOffset} />
              <View style={styles.settings}>
                {isEdit ? (
                  <EditProduct
                    onHand={onHand}
                    maxValue={maxValue}
                    toastType={toastType}
                    onToastAction={onToastAction}
                  />
                ) : (
                  <ViewProduct
                    onHand={onHand}
                    maxValue={maxValue}
                    toastType={toastType}
                    onToastAction={onToastAction}
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
