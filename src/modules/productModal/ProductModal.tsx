import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { observer } from 'mobx-react';

import { ScanningProductModel } from '../removeProducts/stores/ScanningProductStore';

import { ProductQuantity } from './components/ProductQuantity';
import { SelectProductJob } from './components/SelectProductJob';
import { productModalStore } from './store';

interface Props {
  product: ScanningProductModel;
  isVisible: boolean;

  onClose: () => void;
  onAddProductToList: (product: ScanningProductModel) => void;
}

const { width, height } = Dimensions.get('window');

const items = ['first', 'second'];

export const ProductModal: React.FC<Props> = observer(
  ({ isVisible, product, onClose, onAddProductToList }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const carouselRef = useRef<ICarouselInstance>(null);

    const clearProductModalStoreOnClose = () => {
      productModalStore.clear();
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
      onAddProductToList({ ...product, jobId });
      clearProductModalStoreOnClose();
    };

    const onPressSkip = () => {
      onAddProductToList({ ...product });
      clearProductModalStoreOnClose();
    };

    useEffect(() => {
      productModalStore.setProduct(product);
    }, []);

    const renderItem = useCallback(
      ({ index }: { index: number }) =>
        index === 0 ? (
          <ProductQuantity
            onPressAddToList={onPressSkip}
            onClose={clearProductModalStoreOnClose}
            onJobSelectNavigation={onJobSelectNavigation}
          />
        ) : (
          <SelectProductJob
            selectedIndex={selectedIndex}
            onClose={clearProductModalStoreOnClose}
            onPressSkip={onPressSkip}
            onPressBack={onPressBack}
            onPressAdd={onPressAdd}
          />
        ),
      [selectedIndex, onPressAdd],
    );

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
              renderItem={renderItem}
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
