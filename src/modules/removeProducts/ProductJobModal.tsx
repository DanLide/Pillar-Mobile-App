import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { SelectProductJob } from './SelectProductJob';
import { ConfirmProduct } from './ConfirmProduct';

import { observer } from 'mobx-react';
import { removeProductsStore, scanningProductStore } from './stores';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const items = ['first', 'second'];

export const ProductJobModal: React.FC<Props> = observer(
  ({ isVisible, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const carouselRef = useRef<ICarouselInstance>(null);

    const clearScanningProductStoreOnClose = () => {
      scanningProductStore.clear();
      onClose();
    };

    const onJobSelectNavigation = () => {
      setSelectedIndex(1);
      carouselRef.current?.next();
    };

    const onPressBack = () => {
      setSelectedIndex(0);
      carouselRef.current?.prev();
    };

    const onPressAdd = (jobId?: number) => {
      if (scanningProductStore.currentProduct) {
        removeProductsStore.addProduct({
          ...scanningProductStore.currentProduct,
          jobId,
        });
        scanningProductStore.clear();
      }
      clearScanningProductStoreOnClose();
    };

    const onPressSkip = () => {
      if (scanningProductStore.currentProduct) {
        removeProductsStore.addProduct(scanningProductStore.currentProduct);
        scanningProductStore.clear();
      }
      clearScanningProductStoreOnClose();
    };

    return (
      <Modal visible={isVisible} transparent={true} animationType="slide">
        <View style={styles.container}>
          <View style={styles.background}>
            <Carousel
              ref={carouselRef}
              loop={false}
              width={width}
              height={height * 0.75}
              autoPlay={false}
              enabled={false}
              windowSize={1}
              data={items}
              scrollAnimationDuration={500}
              renderItem={({ index }) =>
                index === 0 ? (
                  <ConfirmProduct
                    onPressAddToList={onPressSkip}
                    onClose={clearScanningProductStoreOnClose}
                    onJobSelectNavigation={onJobSelectNavigation}
                  />
                ) : (
                  <SelectProductJob
                    selectedIndex={selectedIndex}
                    onClose={clearScanningProductStoreOnClose}
                    onPressSkip={onPressSkip}
                    onPressBack={onPressBack}
                    onPressAdd={onPressAdd}
                  />
                )
              }
            />
          </View>
        </View>
      </Modal>
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
