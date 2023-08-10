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
import { pipe, replace } from 'ramda';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props extends Pick<TextInputProps, 'keyboardType'> {
  currentValue: number;
  maxValue: number;
  minValue: number;
  stepValue: number;
  label?: string;
  initFontSize?: number;
  vertical?: boolean;
  disabled?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: number) => void;
}

const replaceCommasWithDots = replace(',', '.');
const removeExtraDots = replace(/(?<=\..*)\./g, '');
const removeLeadingZero = pipe(String, replace(/^0+/, ''));

const INITIAL_FONT_SIZE = 78;

export const EditQuantity = memo(
  ({
    isEdit,
    currentValue,
    maxValue,
    minValue,
    stepValue,
    label,
    initFontSize = INITIAL_FONT_SIZE,
    vertical,
    disabled,
    keyboardType,
    onChange,
    onRemove,
  }: Props) => {
    const displayCurrentValue = removeLeadingZero(currentValue);
    const displayMaxValue = removeLeadingZero(maxValue);
    const displayMinValue = removeLeadingZero(minValue);

    const layoutInputRef = useRef<null | LayoutRectangle>(null);
    const [displayValue, setDisplayValue] = useState(displayCurrentValue);
    const [fontSize, setFontSize] = useState(initFontSize);

    const containerStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.container, { flexDirection: vertical ? 'column' : 'row' }],
      [vertical],
    );

    const inputStyle = useMemo<StyleProp<TextStyle>>(
      () => [
        styles.input,
        vertical && styles.inputVertical,
        disabled && styles.inputDisabled,
        { fontSize },
      ],
      [disabled, fontSize, vertical],
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
      if (disabled) return <View style={styles.quantityButton} />;

      if (currentValue > minValue) {
        return (
          <TouchableOpacity
            style={quantityButtonStyle}
            onPress={onDecreaseCount}
          >
            <SVGs.MinusIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      if (isEdit) {
        return (
          <TouchableOpacity style={quantityButtonStyle} onPress={onRemove}>
            <SVGs.TrashIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      return <View style={styles.quantityButton} />;
    }, [
      disabled,
      currentValue,
      minValue,
      isEdit,
      quantityButtonStyle,
      onDecreaseCount,
      onRemove,
    ]);

    const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
      layoutInputRef.current = nativeEvent.layout;
    };

    const onContentSizeChange = ({
      nativeEvent: {
        contentSize: { width },
      },
    }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (!layoutInputRef.current?.width || !width) {
        return;
      }
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
        (fontSize * layoutInputRef.current?.width) / width,
      );
      const increasedWidth = (width * increasedFontSize) / fontSize;
      if (layoutInputRef.current?.width >= increasedWidth) {
        setFontSize(
          increasedFontSize > initFontSize
            ? initFontSize
            : increasedFontSize * 0.9,
        );
      }
    };

    return (
      <View style={containerStyle}>
        {DecreaseButton}
        <View>
          {label && (
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>{label}</Text>
            </View>
          )}
          <TextInput
            contextMenuHidden
            editable={!disabled}
            style={inputStyle}
            value={disabled ? '-' : displayValue}
            keyboardType={keyboardType}
            onChangeText={onChangeInputText}
            returnKeyType="done"
            onBlur={onFocusLost}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
          />
        </View>
        {disabled || currentValue === maxValue || isNaN(currentValue) ? (
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
  inputDisabled: {
    color: colors.blackSemiLight,
    backgroundColor: colors.gray,
  },
  inputLabel: {
    color: colors.white,
    fontFamily: fonts.TT_Regular,
    fontSize: 14,
    lineHeight: 28,
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
