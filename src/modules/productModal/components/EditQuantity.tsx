import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

import { Button } from '../../../components';

interface Props {
  currentValue: number;
  maxValue: number;

  onChange: (quantity: number) => void;
}

export const EditQuantity: React.FC<Props> = observer(
  ({ currentValue, maxValue, onChange }) => {
    const onChangeInputText = (text: string) => {
      if (text === '') onChange(0);

      if (maxValue < +text) return;

      if (text) {
        onChange(+text);
      }
    };

    const onIncreaseCount = () => {
      if (currentValue >= maxValue) return;

      onChange(currentValue + 1);
    };

    const onDecreaseCount = () => {
      if (currentValue === 0) return;

      onChange(currentValue - 1);
    };
    return (
      <View style={styles.quantityContainer}>
        <Button
          buttonStyle={styles.quantityButton}
          textStyle={styles.quantityButtonText}
          title="-"
          onPress={onDecreaseCount}
        />
        <TextInput
          style={styles.input}
          value={`${currentValue}`}
          keyboardType="number-pad"
          onChangeText={onChangeInputText}
        />
        <Button
          buttonStyle={styles.quantityButton}
          textStyle={styles.quantityButtonText}
          title="+"
          onPress={onIncreaseCount}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  quantityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 24,
  },
  input: {
    height: 150,
    width: 200,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 64,
    textAlign: 'center',
  },
  quantityButton: {
    width: 50,
    height: 50,
  },
  quantityButtonText: {
    width: 50,
    height: 50,
    fontSize: 40,
    textAlign: 'center',
  },
});
