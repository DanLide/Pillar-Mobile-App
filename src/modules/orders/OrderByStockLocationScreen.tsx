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
import { ordersStore } from './stores';
import { colors, fonts } from '../../theme';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
} from '../../components';
import {
  AppNavigator,
  LeftBarType,
  OrdersParamsList,
} from '../../navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { getScreenOptions } from '../../navigation/helpers';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';
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
  const [modalParams, setModalParams] =
    useState<OrderProductModal>(initModalParams);
  const [isProductsMissingModal, setIsProductsMissingModal] =
    useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const { currentOrder } = ordersStoreRef;

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Product</Text>
        <Text style={[styles.headerText, styles.headerCenter]}>
          Received/Ordered
        </Text>
        <Text style={[styles.headerText, styles.headerRight]}>Receiving</Text>
      </View>
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<ProductModel>) => (
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
        +{(item.receivedQty || 0) > 0 ? item.receivedQty : item.shippedQty}
      </Text>
    </Pressable>
  );
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
    setModalParams({
      type: ProductModalType.ReceiveOrder,
      maxValue: item.orderedQty,
      onHand: item.receivedQty,
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
    const result = await receiveOrder(ordersStoreRef);

    if (result) {
      Alert.alert('Request Failed!');
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
    const product = { ...modalParams.currentProduct };
    product.receivedQty = quantity;
    setModalParams({
      ...modalParams,
      currentProduct: product as ProductModel,
    });
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={currentOrder?.order.orderArea}
      />
      {renderHeader()}
      <FlatList
        data={currentOrder?.productList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.button}>
        <Button type={ButtonType.primary} title="Receive" onPress={onReceive} />
      </View>
      <ProductModal
        {...modalParams}
        stockName={currentOrder?.order.orderArea}
        product={modalParams.currentProduct}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onChangeProductQuantity={onChangeProductQuantity}
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
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.neutral30,
  },
  receivingContainer: {
    flexDirection: 'row',
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
