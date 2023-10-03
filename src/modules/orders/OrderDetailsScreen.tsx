import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { groupBy } from 'ramda';

import { ordersStore } from './stores';
import {
  OrderTitleByStatusType,
  StatusBadge,
  getBadgeStyleByStatusType,
} from './components/StatusBadge';
import { AppNavigator, OrdersParamsList } from '../../navigation/types';
import { fetchOrderDetails } from '../../data/fetchOrderDetails';
import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';
import { OrderStatusType } from '../../constants/common.enum';
import { OrdersDetailsStockList } from './components/OrdersDetailsStockList';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.OrderDetailsScreen
>;

export const OrderDetailsScreen = observer(({ navigation, route }: Props) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const { currentOrder } = ordersStoreRef;
  const orderProductsByStockName = groupBy(
    product => product.stockLocationName || '',
    currentOrder?.productList || [],
  );
  const [selectedStock, setSelectedStock] = useState<string | undefined>(
    undefined,
  );

  const onSelectProducts: (currentStockNames: string) => void = useCallback(
    (currentStockNames: string) => {
      setSelectedStock(currentStockNames);
    },
    [],
  );

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const result = await fetchOrderDetails(route.params.orderId);
    if (result) {
      setIsError(true);
    }
    setIsLoading(false);
  }, [route.params.orderId]);

  useEffect(() => {
    if (isFocused) {
      fetchOrder();
    }
  }, [fetchOrder, isFocused]);

  const onNavigateToOrderByStockLocation = useCallback(() => {
    if (selectedStock) {
      ordersStoreRef.setSelectedProductsByStock(selectedStock);
      navigation.navigate(AppNavigator.OrderByStockLocationScreen);
    }
  }, [navigation, ordersStoreRef, selectedStock]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.image}>
          <SVGs.JobListErrorIcon />
          <Text style={styles.text}>
            Sorry, there was an issue loading a list of orders.
          </Text>
        </View>
        <Button
          type={ButtonType.secondary}
          title="Retry"
          onPress={fetchOrder}
          buttonStyle={styles.button}
        />
      </View>
    );
  }

  if (currentOrder) {
    const OrderDetailsScree = () => {
      switch (currentOrder.order.status) {
        case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
          return 'This order is waiting for a PO to be sent to the Distributor.';
        case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
          return 'This order is submitted and pending';
        case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
          return 'This order has been shipped to the shop.';
        case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
          return 'Before this order can be received, Manager approval is needed.';
        case OrderTitleByStatusType[OrderStatusType.CLOSED]:
          return 'This order is closed. All items have been received.';
        case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
          return 'This order was cancelled.';
        case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
          return 'Some items in this order have not been received.';
        default:
          return null;
      }
    };

    const renderButton = () => {
      switch (currentOrder.order.status) {
        case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title="Unlock and Receive"
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title="Receive"
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title="Unlock and Receive"
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
        case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
        case OrderTitleByStatusType[OrderStatusType.CLOSED]:
        case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
        default:
          return null;
      }
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            {
              flexDirection: 'row',
              padding: 8,
              alignItems: 'center',
            },
            getBadgeStyleByStatusType(currentOrder.order.status),
          ]}
        >
          <StatusBadge orderStatusType={currentOrder.order.status} isString />
          <Text
            style={{
              flex: 1,
              paddingLeft: 8,
              fontSize: 12,
              lineHeight: 18,
              fontFamily: fonts.TT_Regular,
              color: colors.grayDark2,
            }}
          >
            {OrderDetailsScree()}
          </Text>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Order {currentOrder.order.orderId}</Text>
            <Text style={styles.titleDistributor}>
              {currentOrder.order.supplierName}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.stockHeader}>
            <Text style={styles.headerText}>Stock Location</Text>
            <Text style={styles.headerText}>Received/Ordered</Text>
          </View>
          <OrdersDetailsStockList
            productsByStockName={orderProductsByStockName}
            selectedStock={selectedStock}
            onSelectProducts={onSelectProducts}
          />
        </View>
        {renderButton() ? (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 16,
              marginTop: 'auto',
            }}
          >
            {renderButton()}
          </View>
        ) : null}
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.TT_Bold,
    paddingBottom: 8,
  },
  titleDistributor: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    paddingBottom: 4,
  },
  table: {
    backgroundColor: colors.white,
    paddingBottom: 8,
  },
  headerPlaceholder: {
    height: 26,
    width: '15%',
  },
  stockHeader: {
    paddingHorizontal: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark2,
    paddingVertical: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '30%',
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    paddingBottom: 3,
    paddingRight: 8,
    color: colors.purpleDark,
  },
  loading: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 76,
    paddingTop: 16,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    textAlign: 'center',
  },
});
