import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { observer } from 'mobx-react';

import { ordersStore } from './stores';
import { StatusBadge } from './components/StatusBadge';
import { AppNavigator, OrdersParamsList } from '../../navigation/types';
import { fetchOrderDetails } from '../../data/fetchOrderDetails';
import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.OrderDetailsScreen
>;

export const OrderDetailsScreen = observer(({ route }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const { currentOrder } = ordersStoreRef;

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
    fetchOrder();
  }, [fetchOrder]);

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
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Order {currentOrder.order.orderId}</Text>
            <Text style={styles.titleDistributor}>Distributor</Text>
            <Text style={styles.distributor}>
              {currentOrder.order.supplierName}
            </Text>
          </View>
          <View>
            <StatusBadge orderStatusType={currentOrder.order.status} isString />
          </View>
        </View>

        <View style={styles.product}>
          <View style={styles.stock}>
            <View style={styles.stockHeader}>
              <Text style={styles.headerText}>Stock Location</Text>
              <Text style={styles.headerText}>Received/Ordered</Text>
            </View>
            <View style={styles.products}>
              <Text style={styles.stockName}>
                {currentOrder.order.orderArea}
              </Text>
              {currentOrder.productList.map(product => (
                <View style={styles.productDetails} key={product.productId}>
                  <Text
                    style={[styles.productName, styles.productText]}
                    ellipsizeMode="clip"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <Text style={styles.productText}>
                    <Text style={styles.productDetailsBold}>
                      {product.shippedQty}
                    </Text>
                    /{product.orderedQty}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <View style={styles.headerPlaceholder} />
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Receive</Text>
              <SVGs.ChevronIcon color={colors.purpleDark} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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
  distributor: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
  },
  products: {
    paddingLeft: 16,
  },
  stockName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Bold,
    paddingVertical: 8,
  },
  product: {
    flexDirection: 'row',
  },
  headerPlaceholder: {
    height: 26,
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
  stock: {
    flex: 1,
  },
  stockHeader: {
    paddingLeft: 16,
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
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    paddingBottom: 3,
    paddingRight: 8,
    color: colors.purpleDark,
  },
  productDetails: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  productDetailsBold: {
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    fontSize: 14,
  },
  productText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  productName: {
    flex: 1,
    marginRight: 0,
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
