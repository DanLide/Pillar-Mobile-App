import React, {
  useCallback,
  memo,
  useMemo,
  useState,
  useRef,
} from 'react';
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
} from 'react-native';
import { pipe, replace } from 'ramda';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props extends Pick<TextInputProps, 'keyboardType'> {
  currentValue: number;
  maxValue: number;
  minValue: number;
  stepValue: number;
  disabled?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: number) => void;
}

const replaceCommasWithDots = replace(',', '.');
const removeExtraDots = replace(/(?<=\..*)\./g, '');
const removeLeadingZero = pipe(String, replace(/^0+/, ''));
const INITIAL_FONT_SIZE = 78

export const EditQuantity = memo(
  ({
    isEdit,
    currentValue,
    maxValue,
    minValue,
    stepValue,
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
    const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);

    const style = {
      fontSize: fontSize,
    };

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

      const displayText = updatedCount === 0 ? String(updatedCount) : removeLeadingZero(updatedCount);

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

      if (currentValue >= minValue) {
        return (
          <TouchableOpacity
            style={[styles.quantityButton, styles.border]}
            onPress={onDecreaseCount}
          >
            <SVGs.MinusIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      return <View style={styles.quantityButton} />;
    }, [currentValue, isEdit, minValue, disabled, onDecreaseCount, onRemove]);

    const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
      layoutInputRef.current = nativeEvent.layout;
    };

    const onContentSizeChange = ({ nativeEvent: { contentSize: { width } } }:
      NativeSyntheticEvent<TextInputContentSizeChangeEventData>
    ) => {
      if (!layoutInputRef.current?.width || !width) {
        return
      }
      if (layoutInputRef.current?.width < width) {
        return setFontSize(PixelRatio.roundToNearestPixel(fontSize * layoutInputRef.current?.width / width) * 0.9);
      }
      if (fontSize === INITIAL_FONT_SIZE) {
        return
      }
      const increasedFontSize = PixelRatio.roundToNearestPixel(fontSize * layoutInputRef.current?.width / width);
      const increasedWidth = width * increasedFontSize / fontSize;
      if (layoutInputRef.current?.width >= increasedWidth) {
        setFontSize(increasedFontSize > INITIAL_FONT_SIZE ? INITIAL_FONT_SIZE : increasedFontSize * 0.9);
      }
    }

    return (
      <View style={styles.container}>
        {DecreaseButton}
        <TextInput
          contextMenuHidden
          editable={!disabled}
          style={[styles.input, style, disabled && styles.inputDisabled]}
          value={disabled ? '-' : displayValue}
          keyboardType={keyboardType}
          onChangeText={onChangeInputText}
          returnKeyType="done"
          onBlur={onFocusLost}
          onLayout={onLayout}
          onContentSizeChange={onContentSizeChange}
        />
        {disabled || currentValue === maxValue || isNaN(currentValue) ? (
          <View style={styles.quantityButton} />
        ) : (
          <TouchableOpacity
            style={[styles.quantityButton, styles.border]}
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
    flexDirection: 'row',
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
  quantityButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
  },
});
