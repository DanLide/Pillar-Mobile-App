import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { observer } from 'mobx-react';

import { ScanningProductModel } from '../removeProducts/stores/ScanningProductStore';

import { Modal } from '../../components';
import { ProductQuantity } from './components/quantityTab/ProductQuantity';
import { SelectProductJob } from './components/SelectProductJob';

import { colors } from '../../theme';
import { productModalStore } from './store';
import { removeProductsStore } from '../removeProducts/stores';

interface Props {
  product?: ScanningProductModel;

  onClose: () => void;
  onAddProductToList: (product: ScanningProductModel) => void;
}

const { width, height } = Dimensions.get('window');

export enum Tabs {
  EditQuantity,
  LinkJob,
}

const tabs = [Tabs.EditQuantity, Tabs.LinkJob];

export const ProductModal: React.FC<Props> = observer(
  ({ product, onClose, onAddProductToList }) => {
    const carouselRef = useRef<ICarouselInstance>(null);
    const store = useRef(productModalStore).current;

    const [selectedTab, setSelectedTab] = useState<number>(0);

    const productFromStore = store.getProduct;

    useEffect(() => {
      if (product) {
        store.setProduct(product);
      }
    }, [product, store]);

    const onJobSelectNavigation = () => {
      setSelectedTab(Tabs.LinkJob);
      carouselRef.current?.next();
    };

    const onPressBack = () => {
      setSelectedTab(Tabs.EditQuantity);
      carouselRef.current?.prev();
    };

    const clearProductModalStoreOnClose = useCallback(() => {
      setSelectedTab(0);
      onClose();
    }, [onClose]);

    const renderItem = useCallback(
      ({ index }: { index: number }) => {
        const onPressAdd = (jobId?: number) => {
          if (productFromStore) {
            onAddProductToList({ ...productFromStore, jobId });
            clearProductModalStoreOnClose();
          }
        };

        const onPressSkip = () => {
          if (productFromStore) {
            onAddProductToList({ ...productFromStore });
            clearProductModalStoreOnClose();
          }
        };

        switch (index) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
              />
            );
          case Tabs.LinkJob:
            return (
              <SelectProductJob
                selectedTab={selectedTab}
                isRecoverable={productFromStore?.isRecoverable}
                onPressSkip={onPressSkip}
                onPressBack={onPressBack}
                onPressAdd={onPressAdd}
              />
            );
          default:
            return <View />;
        }
      },
      [
        clearProductModalStoreOnClose,
        onAddProductToList,
        productFromStore,
        selectedTab,
      ],
    );

    const title = useMemo<string>(() => {
      switch (selectedTab) {
        case Tabs.EditQuantity:
          return 'Adjust Quantity';
        case Tabs.LinkJob:
          return 'Link to Job Number';
        default:
          return '';
      }
    }, [selectedTab]);

    return (
      <Modal
        isVisible={!!product}
        onClose={clearProductModalStoreOnClose}
        title={removeProductsStore.stockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={64}
        semiTitle={title}
      >
        <Carousel
          ref={carouselRef}
          loop={false}
          width={width}
          height={height - 64 - 55}
          autoPlay={false}
          enabled={false}
          data={tabs}
          scrollAnimationDuration={500}
          renderItem={renderItem}
        />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
});
