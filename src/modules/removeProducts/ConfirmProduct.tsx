import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { observer } from 'mobx-react';

import { Button } from '../../components';

import { scanningProductStore } from './stores';

const { height } = Dimensions.get('window');

interface Props {
  onClose: () => void;
  onPressAddToList: () => void;
  onJobSelectNavigation: () => void;
}

export const ConfirmProduct: React.FC<Props> = observer(
  ({ onClose, onPressAddToList, onJobSelectNavigation }) => {
    const onChangeInputText = (text: string) => {
      if (text === '') scanningProductStore.setProductReservedCount('0');

      if (
        scanningProductStore.currentProduct?.onHand &&
        scanningProductStore.currentProduct?.onHand <= +text
      )
        return;

      if (text) {
        scanningProductStore.setProductReservedCount(text);
      }
    };

    const onIncreaseCount = () => {
      if (
        scanningProductStore.currentProduct?.onHand &&
        scanningProductStore.currentProduct?.onHand <=
          scanningProductStore.currentProductReservedCount
      )
        return;

      scanningProductStore.setProductReservedCount(
        scanningProductStore.currentProductReservedCount + 1,
      );
    };

    const onDecreaseCount = () => {
      if (scanningProductStore.currentProductReservedCount === 0) return;

      scanningProductStore.setProductReservedCount(
        scanningProductStore.currentProductReservedCount - 1,
      );
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

        <Text style={styles.name}>
          {scanningProductStore.currentProduct?.name}
        </Text>

        <View style={styles.quantityContainer}>
          <Button
            buttonStyle={styles.quantityButton}
            textStyle={styles.quantityButtonText}
            title="-"
            onPress={onDecreaseCount}
          />
          <TextInput
            style={styles.input}
            value={`${scanningProductStore.currentProductReservedCount}`}
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

        <Text style={styles.availableCount}>
          Available {scanningProductStore.currentProduct?.onHand}
        </Text>

        {scanningProductStore.isProductRecoverable ? (
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  background: {
    backgroundColor: 'white',
    marginTop: height * 0.25,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
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
  details: {
    fontSize: 18,
    textAlign: 'center',
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
