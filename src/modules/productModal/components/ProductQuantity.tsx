import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Button } from '../../../components';
import { observer } from 'mobx-react';

import { productModalStore } from '../store';

import { EditQuantity } from './EditQuantity';

interface Props {
  onClose: () => void;
  onPressAddToList: () => void;
  onJobSelectNavigation: () => void;
}

export const ProductQuantity: React.FC<Props> = observer(
  ({ onClose, onPressAddToList, onJobSelectNavigation }) => {
    const product = productModalStore?.product || ({} as any);

    const onChange = (quantity: number) => {
      console.log(quantity, 'onChange');
      productModalStore.updateQuantity(quantity);
    };
    return (
      <>
        <View style={styles.header}>
          <View style={{ width: 100 }} />
          <Text style={styles.headerTitle}>Add to list</Text>
          <View style={{ width: 100 }}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.name}>{product.name}</Text>

        <EditQuantity
          maxValue={product.onHand}
          currentValue={product?.reservedCount}
          onChange={onChange}
        />

        <Text style={styles.availableCount}>Available {product.onHand}</Text>

        {product.isRecoverable ? (
          <Button
            buttonStyle={styles.continueButton}
            title="Continue"
            onPress={onJobSelectNavigation}
          />
        ) : (
          <>
            <Text onPress={onJobSelectNavigation} style={styles.availableCount}>
              Link to job number
            </Text>
            <Button
              buttonStyle={styles.continueButton}
              title="Add to List"
              onPress={onPressAddToList}
            />
          </>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 36,
  },
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
  availableCount: {
    fontSize: 18,
    margin: 12,
    textAlign: 'center',
  },
  continueButton: {
    margin: 36,
  },
});
