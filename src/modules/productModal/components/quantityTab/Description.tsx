import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
// eslint-disable-next-line import/default
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import { colors, fonts } from '../../../../theme';
import { ProductModel } from '../../../../stores/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  product?: ProductModel;
  topOffset?: SharedValue<number>;
}

const CONTAINER_SHADOW_OPACITY = 0.12;
const SIZE_CONTAINER_HEIGHT = 22;

export const Description = memo(({ product, topOffset }: Props) => {
  const modalCollapsedOffset = useHeaderHeight();
  const { top: modalExpandedOffset } = useSafeAreaInsets();

  const scrollOffset = useDerivedValue(
    () => topOffset?.value ?? modalCollapsedOffset,
    [topOffset],
  );

  const containerAnimatedStyle = useAnimatedStyle<ViewStyle>(
    () => ({
      shadowOpacity: interpolate(
        scrollOffset.value,
        [modalCollapsedOffset, modalExpandedOffset],
        [0, CONTAINER_SHADOW_OPACITY],
      ),
    }),
    [scrollOffset],
  );

  const sizeAnimatedStyle = useAnimatedStyle<TextStyle>(
    () => ({
      height: interpolate(
        scrollOffset.value,
        [modalCollapsedOffset, modalExpandedOffset],
        [SIZE_CONTAINER_HEIGHT, 0],
        { extrapolateRight: Extrapolation.CLAMP },
      ),
      opacity: interpolate(
        scrollOffset.value,
        [modalCollapsedOffset, modalExpandedOffset],
        [1, 0],
      ),
    }),
    [scrollOffset],
  );

  const nameAnimatedStyle = useAnimatedStyle<TextStyle>(
    () => ({
      fontSize: interpolate(
        scrollOffset.value,
        [modalCollapsedOffset, modalExpandedOffset],
        [17, 15],
      ),
      lineHeight: interpolate(
        scrollOffset.value,
        [modalCollapsedOffset, modalExpandedOffset],
        [25.5, 15],
      ),
    }),
    [scrollOffset],
  );

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.partNumberContainer}>
        <View>
          <Text style={styles.partNo} numberOfLines={1} ellipsizeMode="middle">
            {product?.manufactureCode} {product?.partNo}
          </Text>
        </View>
      </View>
      <Animated.Text
        style={[styles.name, nameAnimatedStyle]}
        numberOfLines={2}
        ellipsizeMode="middle"
      >
        {product?.name}
      </Animated.Text>
      {product?.size ? (
        <Animated.Text
          style={[styles.size, sizeAnimatedStyle]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {product.size}”
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  partNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 16,
  },
  refundIconPadding: {
    paddingRight: 24,
  },
  partNo: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark2,
    paddingHorizontal: 12,
  },
  name: {
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    paddingVertical: 8,
  },
  size: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
  },
});
