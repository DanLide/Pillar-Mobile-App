import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ListRenderItemInfo,
  Pressable,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';
import { isNil } from 'ramda';

import { ordersStore } from './stores';
import { colors, fonts } from '../../theme';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  Separator,
} from '../../components';
import {
  AppNavigator,
  LeftBarType,
  OrdersParamsList,
} from '../../navigation/types';
import { getScreenOptions } from '../../navigation/helpers';
import {
  ProductModal,
  ProductModalParams,
  ProductModalType,
} from '../productModal';
import { MissingItemsModal } from './components/MissingItemsModal';
import { ProductModel } from '../../stores/types';
import { receiveOrder } from '../../data/receiveOrder';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.OrderByStockLocationScreen
>;

interface OrderProductModal extends ProductModalParams {
  currentProduct?: ProductModel;
}

const initModalParams: OrderProductModal = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const OrderByStockLocationScreen = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalParams, setModalParams] =
    useState<OrderProductModal>(initModalParams);
  const [isProductsMissingModal, setIsProductsMissingModal] =
    useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const { currentOrder, getCurrentProductsByStockName } = ordersStoreRef;
  const stockName =
    getCurrentProductsByStockName &&
    getCurrentProductsByStockName[0].stockLocationName;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Product</Text>
      <Text style={[styles.headerText, styles.headerCenter]}>
        Received/Ordered
      </Text>
      <Text style={[styles.headerText, styles.headerRight]}>Receiving</Text>
    </View>
  );

  const renderItem = ({ item }: ListRenderItemInfo<ProductModel>) =>
    !isNil(item.receivedQty) && !isNil(item.reservedCount) ? (
      <Pressable style={styles.item} onPress={() => onSelectProduct(item)}>
        <View style={styles.description}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemName}>
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemSize}>
            {item.size}
          </Text>
        </View>
        <Text style={styles.itemOrdered}>
          <Text style={styles.boldText}>{item.receivedQty}</Text>/
          {item.orderedQty}
        </Text>
        <Text style={styles.itemReceiving}>
          +{Math.abs(item.receivedQty - item.reservedCount)}
        </Text>
      </Pressable>
    ) : null;

  useEffect(() => {
    if (currentOrder?.order.orderId) {
      navigation.setOptions(
        getScreenOptions({
          title: `Receive Order ${currentOrder?.order.orderId}`,
          leftBarButtonType: LeftBarType.Back,
        }) as Partial<NativeStackNavigationEventMap>,
      );
    }
  }, [currentOrder, navigation]);

  const onSelectProduct = (item: ProductModel) => {
    if (isNil(item.orderedQty) || isNil(item.receivedQty)) return;

    setModalParams({
      type: ProductModalType.ReceiveOrder,
      maxValue: item.orderedQty,
      minValue: 0,
      value: item.receivedQty,
      currentProduct: item,
    });
  };

  const onReceive = () => {
    if (ordersStoreRef.isProductItemsMissing) {
      setIsProductsMissingModal(true);
    } else {
      onUpdateOrder();
    }
  };

  const onUpdateOrder = async () => {
    if (isProductsMissingModal) setIsProductsMissingModal(false);
    setIsLoading(true);
    const result = await receiveOrder(ordersStoreRef);
    setIsLoading(false);

    if (result) {
      Alert.alert('Order confirmation was not successful. Please retry.');
    } else {
      navigation.navigate(AppNavigator.ResultScreen);
    }
  };

  const onSubmitProduct = () => {
    if (modalParams.currentProduct) {
      ordersStoreRef.updateCurrentOrderProduct(modalParams.currentProduct);
    }
    setModalParams(initModalParams);
  };

  const onCloseModal = () => {
    setModalParams(initModalParams);
  };

  const onChangeProductQuantity = (quantity: number) => {
    if (!modalParams.currentProduct) return;

    const product = { ...modalParams.currentProduct, receivedQty: quantity };

    setModalParams({
      ...modalParams,
      value: quantity,
      currentProduct: product,
    });
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar type={InfoTitleBarType.Primary} title={stockName} />
      {renderHeader()}
      <FlatList
        data={getCurrentProductsByStockName}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={Separator}
      />
      <View style={styles.button}>
        <Button
          type={ButtonType.primary}
          title="Receive"
          onPress={onReceive}
          isLoading={isLoading}
        />
      </View>
      <ProductModal
        {...modalParams}
        stockName={stockName}
        product={modalParams.currentProduct}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onChangeProductQuantity={onChangeProductQuantity}
        isHideDecreaseButton={modalParams.maxValue === modalParams.minValue}
      />
      <MissingItemsModal
        onSubmit={onUpdateOrder}
        isVisible={isProductsMissingModal}
        onClose={() => setIsProductsMissingModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.neutral30,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    color: colors.blackSemiLight,
  },
  headerRight: {
    width: '20%',
    textAlign: 'right',
  },
  headerCenter: {
    flex: 1,
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  description: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    color: colors.purpleDark,
  },
  itemSize: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  itemOrdered: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  itemReceiving: {
    width: '20%',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    fontSize: 14,
  },
  button: {
    padding: 16,
    backgroundColor: colors.white,
  },
});
