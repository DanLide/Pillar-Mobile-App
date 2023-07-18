import React, { memo } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
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

interface Props {
  product?: ProductModel;
  topOffset: SharedValue<number>;
}

const CONTAINER_SHADOW_OPACITY = 0.12;
const SIZE_CONTAINER_HEIGHT = 24;

export const Description = memo(({ product, topOffset }: Props) => {
  const scrollCollapsed = useHeaderHeight();
  const { top: scrollExpanded } = useSafeAreaInsets();

  const containerAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    shadowOpacity: interpolate(
      topOffset.value,
      [scrollCollapsed, scrollExpanded],
      [0, CONTAINER_SHADOW_OPACITY],
    ),
  }));

  const sizeAnimatedStyle = useAnimatedStyle<TextStyle>(() => ({
    height: interpolate(
      topOffset.value,
      [scrollCollapsed, scrollExpanded],
      [SIZE_CONTAINER_HEIGHT, 0],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      topOffset.value,
      [scrollCollapsed, scrollExpanded],
      [1, 0],
    ),
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.partNumberContainer}>
        <View>
          <Text style={styles.partNo} numberOfLines={1} ellipsizeMode="middle">
            {product?.manufactureCode} {product?.partNo}
          </Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={2} ellipsizeMode="middle">
        {product?.name}
      </Text>
      <Animated.Text
        style={[styles.size, sizeAnimatedStyle]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {product?.size}
      </Animated.Text>
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
  },
  refundIconPadding: {
    paddingRight: 24,
  },
  partNo: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.blackLight,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 17,
    lineHeight: 25.5,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    paddingTop: 5.75,
  },
  size: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingTop: 8,
  },
});
