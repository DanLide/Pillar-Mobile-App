import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Button } from '../../../components';
import { observer } from 'mobx-react';
import { CloseIcon, TableIcon } from '../../../../assets/svg'
import { fonts } from '../../../theme'
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

    const isRenderStockNumber = product.onHand > 99


    return (
      <>
        <View style={styles.header}>
          <View style={{ width: 20, }}>
            <TouchableOpacity onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Adjust Quantity</Text>
          <View style={{ width: 20 }} />
        </View>

        <Text style={styles.name}>{product.name}</Text>

        <EditQuantity
          maxValue={product.onHand}
          currentValue={product?.reservedCount}
          onChange={onChange}
        />
        <View style={styles.labelContainer}>
          {
            isRenderStockNumber && <View style={[styles.container, { marginRight: 8 }]}>
              <Text style={styles.smallTitle}>In Stock</Text>
              <Text style={styles.subTitle2}>99+</Text>
            </View>
          }
          <View style={[styles.container, isRenderStockNumber && { marginLeft: 8 }]}>
            <Text style={styles.smallTitle}>Remove by</Text>
            <Text style={styles.subTitle}>{productModalStore?.userTypeName}</Text>
          </View>
        </View>
        {product.isRecoverable ? (
          <Button
            buttonStyle={styles.continueButton}
            title="Continue"
            onPress={onJobSelectNavigation}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={onJobSelectNavigation}
              style={styles.linkButton}>
              <TableIcon />
              <Text style={styles.linkText}>
                Link to job number
              </Text>
            </TouchableOpacity>
            <Button
              buttonStyle={styles.continueButton}
              title="Add to List"
              onPress={onPressAddToList}
            />
          </>
        )
        }
      </>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    marginVertical: 24,
    marginHorizontal: 20,
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
  linkText: {
    color: '#5A2099',
    fontSize: 18,
    marginLeft: 8,
  },
  linkButton: {
    marginTop: 34,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallTitle: {
    color: '#95959E',
    fontFamily: fonts.TT_Regular,
    fontSize: 10,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#0A672F',
    backgroundColor: '#D9FAE6',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 2,
    paddingHorizontal: 13
  },
  subTitle2: {
    color: '#58585F',
    backgroundColor: '#F2F2F5',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 2,
    paddingHorizontal: 13,
    fontSize: 18,
    textAlign: 'center',
  },
  continueButton: {
    margin: 36,
    marginTop: 'auto',
  },
  container: {
    alignItems: 'center',
  },
  labelContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
