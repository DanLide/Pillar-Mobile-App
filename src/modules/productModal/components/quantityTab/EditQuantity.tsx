import React, { useCallback, memo, useMemo } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props {
  currentValue: number;
  maxValue: number;

  onChange: (quantity: number) => void;
}

export const EditQuantity = memo(
  ({ currentValue, maxValue, onChange }: Props) => {
    const onChangeInputText = (text: string) => {
      if (!Number(text) || maxValue < +text) return;

      if (text) {
        onChange(+text);
      }
    };

    const onIncreaseCount = useCallback(() => {
      if (currentValue >= maxValue) return;

      onChange(currentValue + 1);
    }, [currentValue, maxValue, onChange]);

    const onDecreaseCount = useCallback(() => {
      if (currentValue === 0) return;

      onChange(currentValue - 1);
    }, [currentValue, onChange]);

    const DecreaseButton = useMemo(() => {
      return currentValue > 1 ? (
        <TouchableOpacity
          style={[styles.quantityButton, styles.border]}
          onPress={onDecreaseCount}
        >
          <SVGs.MinusIcon color={colors.black} />
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityButton} />
      );
    }, [currentValue, onDecreaseCount]);

    return (
      <View style={styles.container}>
        {DecreaseButton}
        <TextInput
          style={styles.input}
          value={`${currentValue}`}
          keyboardType="number-pad"
          onChangeText={onChangeInputText}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.quantityButton, styles.border]}
          onPress={onIncreaseCount}
        >
          <SVGs.PlusIcon color={colors.black} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 58.5,
    marginTop: 8,
  },
  input: {
    height: 103,
    width: 140,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
    fontSize: 78,
    fontFamily: fonts.TT_Bold,
    textAlign: 'center',
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
