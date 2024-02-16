import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import {
  Insets,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
// eslint-disable-next-line import/default
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, SVGs } from '../theme';
import { testIds } from '../helpers';

export enum InputType {
  Primary,
}

interface Props extends TextInputProps {
  type?: InputType;
  label?: string;
  rightLabel?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.NamedExoticComponent<SvgProps> | React.FC<SvgProps>;
  testID?: string;
  onRightIconPress?: () => void;
}

const HIT_SLOP: Insets = {
  bottom: 24,
  left: 24,
  right: 24,
  top: 24,
};

const Input = forwardRef(
  (
    {
      type,
      label,
      rightLabel,
      error,
      containerStyle,
      rightIcon: RightIcon,
      onRightIconPress,
      style,
      testID = 'input',
      onChangeText,
      ...props
    }: Props,
    ref: React.ForwardedRef<TextInput>,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChangeText = useCallback(
      (text: string) => {
        if (!onChangeText) return;

        const updatedText = text.replace(
          /[\u0400-\u04FF\u0500-\u052F\uA640-\uA69F]+/g, // Exclude Cyrillic
          '',
        );

        onChangeText(updatedText);
      },
      [onChangeText],
    );

    const mergedContainerStyle = useMemo<StyleProp<ViewStyle>>(() => {
      switch (type) {
        case InputType.Primary:
          return [
            styles.container,
            styles.containerPrimary,
            isFocused && styles.containerActive,
            containerStyle,
          ];
        default:
          return [styles.container, containerStyle];
      }
    }, [containerStyle, isFocused, type]);

    const inputStyle = useMemo<StyleProp<TextStyle>>(() => {
      switch (type) {
        case InputType.Primary:
          return [styles.input, styles.inputPrimary, style];
        default:
          return [styles.input, style];
      }
    }, [style, type]);

    const labelStyle = useAnimatedStyle(() => ({
      color: isFocused ? colors.purpleDark : colors.grayDark2,
      fontSize: withTiming(isFocused || props.value?.length ? 12 : 16, {
        duration: 200,
      }),
      top: withTiming(isFocused || props.value?.length ? -8 : 16, {
        duration: 200,
      }),
      left: withTiming(isFocused || props.value?.length ? 6 : 16, {
        duration: 200,
      }),
    }));

    const Label = useMemo<JSX.Element | null>(() => {
      if (!label) return null;

      return (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      );
    }, [label, labelStyle]);

    const RightLabel = useMemo<JSX.Element | null>(() => {
      if (!rightLabel) return null;

      return <Text style={styles.rightLabelContainer}>{rightLabel}</Text>;
    }, [rightLabel]);

    const BottomLabel = useMemo<JSX.Element | null>(() => {
      if (!error) return null;

      return <Text style={styles.labelBottom}>{error}</Text>;
    }, [error]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const InputRightIcon = useMemo<JSX.Element | undefined>(() => {
      if (error) {
        return <SVGs.ErrorLinedIcon color={colors.red} />;
      }

      return (
        RightIcon && (
          <Pressable style={styles.rightIcon} onPress={onRightIconPress}>
            <RightIcon color={colors.grayDark3} />
          </Pressable>
        )
      );
    }, [RightIcon, error, onRightIconPress]);

    return (
      <View style={mergedContainerStyle} testID={testIds.idContainer(testID)}>
        {Label}
        {RightLabel}
        <TextInput
          hitSlop={HIT_SLOP}
          style={inputStyle}
          placeholderTextColor={colors.grayDark}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          onChangeText={handleChangeText}
          {...props}
        />
        {InputRightIcon}
        {BottomLabel}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.neutral30,
    borderRadius: 9.5,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4.5,
    height: 47,
    paddingLeft: 14,
    paddingVertical: 9.5,
  },
  containerActive: {
    borderColor: colors.purple,
    borderWidth: 1.5,
  },
  containerPrimary: {
    borderColor: colors.neutral30,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: colors.blackLight,
    fontFamily: fonts.TT_Regular,
    fontSize: 19,
    lineHeight: 23.5,
  },
  inputPrimary: {
    color: colors.grayDark2,
    fontSize: 16,
    lineHeight: 20,
  },
  label: {
    fontFamily: fonts.TT_Regular,
    lineHeight: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    left: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
  },
  labelActive: {
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
  },
  labelBottom: {
    bottom: -20,
    color: colors.redDark,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    left: 0,
    lineHeight: 16,
    paddingTop: 3,
    position: 'absolute',
  },
  labelContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 1,
    position: 'absolute',
    zIndex: 1,
  },
  rightIcon: {
    height: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  rightLabelContainer: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    right: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
    zIndex: 1,
  },
});

export default memo(Input);
