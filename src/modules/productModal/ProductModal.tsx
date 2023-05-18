import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { StyleSheet, Dimensions, View, Alert } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { observer } from 'mobx-react';

import { ScanningProductModel } from '../removeProducts/stores/ScanningProductStore';

import { Modal } from '../../components';
import { ProductQuantity } from './components/quantityTab/ProductQuantity';
import { SelectProductJob } from './components/SelectProductJob';

import { colors } from '../../theme';
import { productModalStore } from './store';
import { removeProductsStore } from '../removeProducts/stores';
import { ModalType } from '../removeProducts/RemoveProductsScreen';
import { RemoveProductModel } from '../removeProducts/stores/RemoveProductsStore';
import { JobModel } from '../jobsList/stores/JobsStore';
import { isRemoveProductModel } from '../removeProducts/helpers';

interface Props {
  product?: ScanningProductModel;
  type?: ModalType;

  onRemove?: (product: RemoveProductModel) => void;
  onClose: () => void;
  onSubmit: (product: ScanningProductModel) => void;
}

const { width, height } = Dimensions.get('window');

export enum Tabs {
  EditQuantity,
  LinkJob,
}

const tabs = [Tabs.EditQuantity, Tabs.LinkJob];

export const ProductModal: React.FC<Props> = observer(
  ({ type, product, onClose, onSubmit, onRemove }) => {
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

    const onRemoveAlert = useCallback(() => {
      Alert.alert('Remove confirmation', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            if (onRemove && isRemoveProductModel(productFromStore))
              onRemove(productFromStore); 
            clearProductModalStoreOnClose();
          },
        },
      ]);
    }, [clearProductModalStoreOnClose, onRemove, productFromStore]);

    const renderItem = useCallback(
      ({ index }: { index: number }) => {
        const onPressAdd = (job?: JobModel) => {
          if (productFromStore) {
            onSubmit({ ...productFromStore, job });
            clearProductModalStoreOnClose();
          }
        };

        const onPressSkip = () => {
          if (productFromStore) {
            onSubmit(productFromStore);
            clearProductModalStoreOnClose();
          }
        };

        switch (index) {
          case Tabs.EditQuantity:
            return (
              <ProductQuantity
                isEdit={type === ModalType.Edit}
                onPressAddToList={onPressSkip}
                onJobSelectNavigation={onJobSelectNavigation}
                onRemove={onRemoveAlert}
              />
            );
          case Tabs.LinkJob:
            return (
              <SelectProductJob
                isEdit={type === ModalType.Edit}
                productJob={productFromStore?.job}
                selectedTab={selectedTab}
                isRecoverableProduct={productFromStore?.isRecoverable}
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
        onSubmit,
        onRemoveAlert,
        productFromStore,
        selectedTab,
        type,
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
