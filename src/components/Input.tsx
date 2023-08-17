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
} from 'react-native';
import { SvgProps } from 'react-native-svg';

import { colors, fonts } from '../theme';
import { testIds } from '../helpers';

export enum InputType {
  Primary,
}

interface Props extends TextInputProps {
  type?: InputType;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.NamedExoticComponent<SvgProps> | React.FC<SvgProps>;
  testID?: string;
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
      containerStyle,
      rightIcon: RightIcon,
      style,
      testID = 'input',
      ...props
    }: Props,
    ref: React.ForwardedRef<TextInput>,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

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

    const Label = useMemo<JSX.Element | null>(() => {
      if (!label) return null;

      return (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isFocused && styles.labelActive]}>
            {label}
          </Text>
        </View>
      );
    }, [isFocused, label]);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
      <View style={mergedContainerStyle} testID={testIds.idContainer(testID)}>
        {Label}
        <TextInput
          hitSlop={HIT_SLOP}
          style={inputStyle}
          placeholderTextColor={colors.grayDark}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          {...props}
        />
        {RightIcon && <RightIcon color={colors.black} />}
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
    paddingHorizontal: 14,
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
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    lineHeight: 16,
  },
  labelActive: {
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
  },
  labelContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    left: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
    zIndex: 1,
  },
});

export default memo(Input);
