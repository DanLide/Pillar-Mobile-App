import { useEffect, useRef, useState } from 'react';
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
import { isNil, forEach } from 'ramda';
import { useTranslation } from 'react-i18next';

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
import { OrderTitleByStatusType } from 'src/modules/orders/components/StatusBadge';
import { OrderStatusType } from 'src/constants/common.enum';

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

const keyExtractor = (item: ProductModel): string => item.uuid;

export const OrderByStockLocationScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalParams, setModalParams] =
    useState<OrderProductModal>(initModalParams);
  const [isProductsMissingModal, setIsProductsMissingModal] =
    useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const { currentOrder, getCurrentProductsByStockName } = ordersStoreRef;
  const stockName =
    getCurrentProductsByStockName &&
    getCurrentProductsByStockName[0].stockLocationName;

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
    //Decrease reservedCount: max count, what we can receiving, depends on the shippedQty
    //For OrderStatusType = SHIPPED
    if (
      currentOrder?.order.status ===
      OrderTitleByStatusType[OrderStatusType.SHIPPED]
    ) {
      if (getCurrentProductsByStockName) {
        forEach((product: ProductModel) => {
          const maxReservedCount = product.shippedQty ?? 0;

          ordersStoreRef.updateCurrentOrderProduct({
            ...product,
            reservedCount: maxReservedCount,
          });
        }, getCurrentProductsByStockName);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentOrder?.order.orderId) {
      navigation.setOptions(
        getScreenOptions({
          title: t('receiveOrderId', { orderId: currentOrder?.order.orderId }),
          leftBarButtonType: LeftBarType.Back,
        }) as Partial<NativeStackNavigationEventMap>,
      );
    }
  }, [currentOrder, navigation, t]);

  const onSelectProduct = (item: ProductModel) => {
    if (
      isNil(item.orderedQty) ||
      isNil(item.receivedQty) ||
      isNil(item.shippedQty)
    )
      return;

    setModalParams({
      type: ProductModalType.ReceiveOrder,
      maxValue:
        currentOrder?.order.status ===
        OrderTitleByStatusType[OrderStatusType.SHIPPED]
          ? item.shippedQty ?? 0
          : item.orderedQty,
      minValue: item.receivedQty,
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
      Alert.alert(t('orderConfirmationWasNotSuccessful'));
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

    const product = { ...modalParams.currentProduct, reservedCount: quantity };

    setModalParams({
      ...modalParams,
      currentProduct: product,
    });
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar type={InfoTitleBarType.Primary} title={stockName} />
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('product')}</Text>
        <Text style={[styles.headerText, styles.headerCenter]}>
          {t('receivedOrdered')}
        </Text>
        <Text style={[styles.headerText, styles.headerRight]}>
          {t('receiving')}
        </Text>
      </View>
      <FlatList
        data={getCurrentProductsByStockName}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
      />
      <View style={styles.button}>
        <Button
          type={ButtonType.primary}
          title={t('receive')}
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
        isAllowZeroValue={true}
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
