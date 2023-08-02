import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/default
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { find, whereEq } from 'ramda';

import { Button, ButtonType, Modal } from '../../../components';
import {
  Description,
  ProductModalProps,
  ProductModalType,
  ProductQuantity,
} from '../../productModal';

import { colors, fonts } from '../../../theme';

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

export const ProductModal = memo(
  ({
    type,
    product,
    stockName,
    categories,
    suppliers,
    enabledSuppliers,
    error,
    isEdit,
    maxValue = 0,
    onHand = 0,
    onSubmit,
    onClose,
    onChangeProductQuantity,
  }: ProductModalProps) => {
    const modalCollapsedOffset = useHeaderHeight();
    const { top: modalExpandedOffset } = useSafeAreaInsets();

    const topOffset = useSharedValue(modalCollapsedOffset);

    const category = useMemo(
      () => find(whereEq({ id: product?.categoryId }), categories),
      [categories, product?.categoryId],
    );

    const supplier = useMemo(
      () =>
        find(whereEq({ partyRoleId: product?.supplierPartyRoleId }), suppliers),
      [product?.supplierPartyRoleId, suppliers],
    );

    const restockFrom = useMemo(
      () =>
        find(
          whereEq({ partyRoleId: product?.supplierPartyRoleId }),
          enabledSuppliers,
        ),
      [enabledSuppliers, product?.supplierPartyRoleId],
    );

    const handleSubmit = useCallback(
      () => product && onSubmit(product),
      [onSubmit, product],
    );

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        topOffset.value = withSpring(destination, SCROLL_ANIMATION_CONFIG);
      },
      [topOffset],
    );

    const clearProductModalStoreOnClose = useCallback(() => {
      scrollTo(modalCollapsedOffset);
      onClose();
    }, [onClose, modalCollapsedOffset, scrollTo]);

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
        <Animated.ScrollView
          onScroll={scrollHandler}
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.contentContainer}
          bounces={false}
        >
          <Description product={product} topOffset={topOffset} />
          <View style={styles.settings}>
            <ProductQuantity
              type={type}
              product={product}
              onChangeProductQuantity={onChangeProductQuantity}
              isEdit={isEdit}
              jobSelectable={false}
              error={error}
              maxValue={maxValue}
              onHand={onHand}
            />
            <Text style={styles.category}>{category?.description}</Text>
            <View style={styles.minMaxContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeTitle}>Minimum Quantity</Text>
                <Text style={styles.badgeQuantity}>{product?.min}</Text>
              </View>
              <Text style={styles.slash}>/</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeTitle}>Maximum Quantity</Text>
                <Text style={styles.badgeQuantity}>{product?.max}</Text>
              </View>
            </View>
            <View style={styles.orderSettings}>
              <View style={styles.badge}>
                <Text style={styles.badgeTitle}>
                  Pieces Per{'\n'} Container
                </Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {product?.unitsPerContainer}
                  </Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeTitle}>Shipment{'\n'} Quantity</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{product?.orderMultiple}</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeTitle}>On Order</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{product?.onOrder}</Text>
                </View>
              </View>
            </View>
            <View style={styles.bottomInfo}>
              <View style={styles.badgeSmall}>
                <Text style={styles.badgeTitle}>Distributor</Text>
                <Text style={styles.badgeSubtitle}>{supplier?.name}</Text>
              </View>
              <View style={styles.badgeSmall}>
                <Text style={styles.badgeTitle}>Restock From</Text>
                <Text style={styles.badgeSubtitle}>{restockFrom?.name}</Text>
              </View>
              <View style={styles.badgeSmall}>
                <Text style={styles.badgeTitle}>UPC</Text>
                <Text style={styles.badgeSubtitle}>{product?.upc}</Text>
              </View>
              <View style={styles.badgeSmall}>
                <Text style={styles.badgeTitle}>Recoverable</Text>
                <Text style={styles.badgeSubtitle}>
                  {product?.isRecoverable ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
        <View style={styles.buttons}>
          <Button
            title="Edit"
            type={ButtonType.secondary}
            buttonStyle={styles.buttonContainer}
          />
          <Button
            title="Done"
            type={ButtonType.primary}
            buttonStyle={styles.buttonContainer}
            onPress={handleSubmit}
          />
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    gap: 8,
  },
  badgeSmall: {
    alignItems: 'center',
    gap: 4,
  },
  badgeSmallTitle: {
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
  badgeTitle: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
  badgeQuantity: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 24,
    lineHeight: 28,
  },
  badgeSubtitle: {
    color: colors.textNeutral,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
    lineHeight: 18,
  },
  bottomInfo: {
    gap: 16,
  },
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
  category: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 20,
  },
  chip: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  chipText: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 14,
  },
  contentContainer: {
    gap: 24,
    paddingBottom: 16,
  },
  minMaxContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  orderSettings: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 40,
  },
  settings: {
    alignItems: 'center',
    gap: 24,
  },
  slash: {
    color: colors.grayDark3,
    fontFamily: fonts.TT_Light,
    fontSize: 44,
    paddingTop: 16,
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
});
