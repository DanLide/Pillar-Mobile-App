import React, { useCallback, memo, useMemo, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TextInputProps,
  LayoutChangeEvent,
  LayoutRectangle,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  PixelRatio,
  StyleProp,
  TextStyle,
  ViewStyle,
  Text,
} from 'react-native';
import { equals, ifElse, pipe, replace } from 'ramda';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props extends Pick<TextInputProps, 'keyboardType'> {
  currentValue: number;
  maxValue: number;
  minValue: number;
  stepValue: number;

  label?: string;
  labelWithNewLine?: string;
  labelContainerStyle?: StyleProp<ViewStyle>;

  initFontSize?: number;
  vertical?: boolean;
  disabled?: boolean;
  hideCount?: boolean;
  error?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: number) => void;
}

const replaceCommasWithDots = replace(',', '.');
const removeExtraDots = replace(/(?<=\..*)\./g, '');
const removeLeadingZero = ifElse(
  equals(0),
  String,
  pipe(String, replace(/^0+/, '')),
);

const INITIAL_FONT_SIZE = 78;

export const EditQuantity = memo(
  ({
    currentValue,
    maxValue,
    minValue,
    stepValue,
    label,
    labelWithNewLine,
    labelContainerStyle,
    initFontSize = INITIAL_FONT_SIZE,
    vertical,
    disabled,
    hideCount,
    error,
    keyboardType,
    onChange,
  }: Props) => {
    const displayCurrentValue = removeLeadingZero(currentValue);
    const displayMaxValue = removeLeadingZero(maxValue);
    const displayMinValue = removeLeadingZero(minValue);

    const layoutInputRef = useRef<null | LayoutRectangle>(null);
    const contentRef = useRef<null | string>(null);

    const [displayValue, setDisplayValue] = useState(displayCurrentValue);
    const [fontSize, setFontSize] = useState(initFontSize);

    const isInputDisabled = disabled || error;
    const isInputHidden = error || hideCount;

    const containerStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.container, { flexDirection: vertical ? 'column' : 'row' }],
      [vertical],
    );

    const inputStyle = useMemo<StyleProp<TextStyle>>(
      () => [
        styles.input,
        vertical && styles.inputVertical,
        isInputHidden && styles.inputHidden,
        { fontSize },
      ],
      [fontSize, isInputHidden, vertical],
    );

    const inputLabelContainerStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.inputLabelContainer, labelContainerStyle],
      [labelContainerStyle],
    );

    const quantityButtonStyle = useMemo<StyleProp<ViewStyle>>(
      () => [
        styles.quantityButton,
        styles.border,
        vertical && styles.quantityButtonVertical,
      ],
      [vertical],
    );

    const setNewValue = useCallback(
      (value: string) => {
        setDisplayValue(value);
        onChange(+value);
      },
      [onChange],
    );

    const onChangeInputText = (text: string) => {
      const normalizedText = pipe(replaceCommasWithDots, removeExtraDots)(text);

      if (maxValue < +normalizedText) {
        return setNewValue(displayMaxValue);
      }

      setNewValue(normalizedText);
    };

    const onIncreaseCount = useCallback(() => {
      const updatedCount =
        Math.floor(currentValue / stepValue) * stepValue + stepValue;

      const displayText = removeLeadingZero(updatedCount);

      setNewValue(displayText);
    }, [currentValue, stepValue, setNewValue]);

    const onDecreaseCount = useCallback(() => {
      const updatedCount =
        Math.ceil(currentValue / stepValue) * stepValue - stepValue;

      const displayText = removeLeadingZero(updatedCount);

      setNewValue(displayText);
    }, [currentValue, stepValue, setNewValue]);

    const onFocusLost = useCallback(() => {
      if (isNaN(currentValue) || currentValue < minValue) {
        return setNewValue(displayMinValue);
      }

      const updatedCount = Math.ceil(currentValue / stepValue) * stepValue;
      const displayText = removeLeadingZero(updatedCount);

      setNewValue(displayText);
    }, [currentValue, minValue, stepValue, setNewValue, displayMinValue]);

    const DecreaseButton = useMemo(() => {
      if (isInputDisabled) return <View style={styles.quantityButton} />;

      if (
        !(currentValue === minValue && minValue === 0) &&
        currentValue >= minValue
      ) {
        return (
          <TouchableOpacity
            style={quantityButtonStyle}
            onPress={onDecreaseCount}
          >
            <SVGs.MinusIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      return <View style={styles.quantityButton} />;
    }, [
      isInputDisabled,
      currentValue,
      minValue,
      quantityButtonStyle,
      onDecreaseCount,
    ]);

    const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
      layoutInputRef.current = nativeEvent.layout;
    };

    const onContentSizeChange = ({
      nativeEvent: {
        contentSize: { width },
      },
    }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (!layoutInputRef.current?.width || !width || contentRef.current === displayValue) {
        return;
      }
      contentRef.current = displayValue;
      if (layoutInputRef.current?.width < width) {
        return setFontSize(
          PixelRatio.roundToNearestPixel(
            (fontSize * layoutInputRef.current?.width) / width,
          ) * 0.9,
        );
      }
      if (fontSize === initFontSize) {
        return;
      }
      const increasedFontSize = PixelRatio.roundToNearestPixel(
        (fontSize * layoutInputRef.current?.width) / width * 0.9,
      );
      const increasedWidth = (width * increasedFontSize) / fontSize;
      if (layoutInputRef.current?.width >= increasedWidth) {
        setFontSize(
          increasedFontSize > initFontSize
            ? initFontSize
            : increasedFontSize,
        );
      }
    };

    return (
      <View style={containerStyle}>
        {DecreaseButton}
        <View>
          {label && (
            <View style={inputLabelContainerStyle}>
              <Text style={styles.inputLabel}>
                {label}
                {labelWithNewLine ? `\n${labelWithNewLine}` : null}
              </Text>
            </View>
          )}
          <TextInput
            contextMenuHidden
            editable={!isInputDisabled}
            style={inputStyle}
            value={error ? '-' : displayValue}
            keyboardType={keyboardType}
            onChangeText={onChangeInputText}
            returnKeyType="done"
            onBlur={onFocusLost}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
          />
        </View>
        {isInputDisabled || currentValue === maxValue || isNaN(currentValue) ? (
          <View style={styles.quantityButton} />
        ) : (
          <TouchableOpacity
            style={quantityButtonStyle}
            onPress={onIncreaseCount}
          >
            <SVGs.PlusIcon color={colors.black} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 11,
    justifyContent: 'center',
  },
  input: {
    height: 103,
    width: 184,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
    fontSize: 78,
    fontFamily: fonts.TT_Bold,
    textAlign: 'center',
  },
  inputHidden: {
    color: colors.blackSemiLight,
    backgroundColor: colors.gray,
  },
  inputLabel: {
    color: colors.white,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 18,
  },
  inputLabelContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.purpleDark2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  inputVertical: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    height: 48,
    maxWidth: 108,
    padding: 8,
  },
  quantityButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonVertical: {
    width: 87,
    height: 48,
  },
  border: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
  },
});
