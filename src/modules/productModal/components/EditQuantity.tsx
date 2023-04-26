import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';


interface Props {
  currentValue: number;
  maxValue: number;

  onChange: (quantity: number) => void;
}

export const EditQuantity: React.FC<Props> = observer(
  ({ currentValue, maxValue, onChange }) => {
    const onChangeInputText = (text: string) => {
      if (!Number(text) || maxValue < +text) return

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

    const renderDecreaseButton = () => {
      return currentValue > 1 ? <TouchableOpacity
        style={[styles.quantityButton, styles.border]}
        onPress={onDecreaseCount}
      >
        <Text style={styles.quantityButtonText}>
          -
        </Text>
      </TouchableOpacity> : <View style={styles.quantityButton} />
    }

    return (
      <View style={styles.quantityContainer}>
        {renderDecreaseButton()}
        <TextInput
          style={styles.input}
          value={`${currentValue}`}
          keyboardType="number-pad"
          onChangeText={onChangeInputText}
        />
        <TouchableOpacity
          style={[styles.quantityButton, styles.border]}
          onPress={onIncreaseCount}
        >
          <Text style={styles.quantityButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  quantityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 12,
  },
  input: {
    height: 150,
    width: 200,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#95959E',
    fontSize: 64,
    textAlign: 'center',
  },
  quantityButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#95959E',
  },
  quantityButtonText: {
    width: 50,
    height: 50,
    fontSize: 40,
    textAlign: 'center',
  },
});
