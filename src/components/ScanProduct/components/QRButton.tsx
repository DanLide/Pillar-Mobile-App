import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SVGs, colors } from 'src/theme';
import { Barcode, BarcodeFormat } from 'vision-camera-code-scanner';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QRIconSize = 24;
const ScaleCoef = 2.2;

type Coordinate = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type QRButtonProps = {
  onPress: () => void;
  index: number;
  isDisabled: boolean;
  coordinates: SharedValue<Coordinate[]>;
  isGreenBorder: boolean;
  barcodeFormat: Barcode['format'];
};

export const QRButton: React.FC<QRButtonProps> = ({
  index,
  coordinates,
  onPress,
  isDisabled,
  isGreenBorder,
  barcodeFormat,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  let CenterIcon =
    barcodeFormat === BarcodeFormat.QR_CODE ? SVGs.QRIcon : SVGs.BarcodeIcon;

  if (isGreenBorder) {
    CenterIcon = SVGs.CheckMark;
  }

  const animatedStyleButton = useAnimatedStyle(() => {
    if (!coordinates?.value?.[index]) return {};

    const { left, right, bottom, top } = coordinates.value[index];

    return {
      height: bottom - top + 30,
      width: right - left + 30,
      transform: [{ translateX: left - 15 }, { translateY: top - 15 }],
    };
  }, []);

  const animatedStyleIcon = useAnimatedStyle(() => {
    if (!coordinates?.value?.[index]) return {};
    const { bottom, top } = coordinates.value[index];

    const height = (bottom - top) / ScaleCoef;
    const scale = height / QRIconSize;

    return {
      transform: [{ scale }],
    };
  }, []);

  return (
    <AnimatedPressable
      style={[
        styles.scanBorder,
        animatedStyleButton,
        (isPressed || isGreenBorder) && styles.greenBorder,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          styles.iconWrapper,
          animatedStyleIcon,
          !isGreenBorder && {
            backgroundColor: colors.white,
          },
        ]}
      >
        <CenterIcon width={QRIconSize} height={QRIconSize} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBorder: {
    borderRadius: 10,
    borderWidth: 5,
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.yellow,
  },
  greenBorder: {
    borderColor: colors.green5,
  },
});
