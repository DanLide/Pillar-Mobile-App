import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, commonStyles, fonts } from 'src/theme';

const WaveIndicator = memo(() => {
  const opacityValue = useSharedValue(0.6);
  const widthVal = useSharedValue(7);
  const heightVal = useSharedValue(80);

  useEffect(() => {
    opacityValue.value = withRepeat(
      withTiming(0, { duration: 750, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    widthVal.value = withRepeat(
      withTiming(15, { duration: 750, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    heightVal.value = withRepeat(
      withTiming(98, { duration: 750, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
  }, [opacityValue, heightVal, widthVal]);

  const aStyle = useAnimatedStyle(() => ({
    width: widthVal.value,
    height: heightVal.value,
    opacity: opacityValue.value,
  }));

  return (
    <Animated.View style={[styles.indicator, commonStyles.absolute, aStyle]} />
  );
});

export const ClickIndicator = memo(() => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={[styles.indicatorContainer, styles.upsideDown]}>
        <View style={styles.indicator} />
        {[...Array(3).keys()].map((_, index) => (
          <WaveIndicator key={index} />
        ))}
      </View>
      <Text style={styles.text}>{t('clickToScan')}</Text>
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator} />
        {[...Array(3).keys()].map((_, index) => (
          <WaveIndicator key={index} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorContainer: {
    marginTop: 2,
    height: 98,
    width: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
  },
  indicator: {
    height: 80,
    width: 7,
    backgroundColor: colors.purpleDark,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  text: {
    position: 'absolute',
    textAlign: 'right',
    right: 14,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.TT_Regular,
    color: colors.textNeutral,
  },
  upsideDown: {
    transform: [{ rotate: '180deg' }],
  },
});
