import React, { memo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { groupBy } from 'ramda';
import { RESULTS } from 'react-native-permissions';

import { StatusBadge } from './StatusBadge';
import { GetOrdersAPIResponse } from '../../../data/api';
import { colors, fonts } from '../../../theme';
import { AppNavigator, OrdersParamsList } from '../../../navigation/types';
import { StockWithProducts } from './StockWithProducts';
import { Separator } from 'src/components';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { OrderStatusType } from 'src/constants/common.enum';
import permissionStore from 'src/modules/permissions/stores/PermissionStore';

type Props = ListRenderItemInfo<GetOrdersAPIResponse> & { isFiltered: boolean };

type OrderScreenNavigationProp = NativeStackNavigationProp<
  OrdersParamsList,
  AppNavigator.OrdersScreen
>;

export const OrdersListItem = memo(({ item, isFiltered }: Props) => {
  const navigation = useNavigation<OrderScreenNavigationProp>();

  const onPress = () => {
    if (
      item.status === OrderStatusType.SUBMITTED ||
      item.status === OrderStatusType.RECEIVING
    ) {
      const isNeedNavToPermission = permissionStore.bluetoothPermission !== RESULTS.GRANTED;
      if (isNeedNavToPermission) {
        navigation.navigate(
          AppNavigator.BluetoothPermissionScreen, {
          nextRoute: AppNavigator.OrderDetailsScreen,
          orderId: item.orderId.toString(),
        }
        );
        return
      }
    }
    navigation.navigate(AppNavigator.OrderDetailsScreen, {
      orderId: item.orderId.toString(),
    });
  };

  const renderProducts = () => {
    const productsByStock = groupBy(
      product => product.stockLocationName || '',
      item.products,
    );

    const renderProduct = (stockNameItem: ListRenderItemInfo<string>) => {
      const products = productsByStock[stockNameItem.item];
      return (
        <StockWithProducts
          orderId={item.orderId}
          stockName={stockNameItem.item}
          products={products}
          productContainerStyle={styles.productContainer}
          totalProductsQty={products.length}
          stockNameStyle={styles.stockName}
        />
      );
    };

    return (
      <FlatList
        data={Object.keys(productsByStock)}
        renderItem={renderProduct}
        ItemSeparatorComponent={Separator}
      />
    );
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <View style={styles.container}>
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumberText}>{item.orderId}</Text>
        </View>

        <View style={styles.distributorContainer}>
          <Text style={styles.distributorName}>{item.supplierName}</Text>
        </View>

        <View style={styles.statusContainer}>
          <StatusBadge orderStatusType={item.status} />
        </View>
      </View>

      {isFiltered ? (
        <View style={styles.products}>{renderProducts()}</View>
      ) : (
        <View style={styles.productsPlaceholder} />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: { paddingBottom: 8 },
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  orderNumberContainer: {
    minWidth: '20%',
    paddingLeft: 8,
  },
  orderNumberText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
  },
  distributorContainer: {
    flex: 1,
    paddingRight: 8,
  },
  distributorName: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
  },
  statusContainer: {
    flex: 0,
  },
  products: { paddingLeft: 32 },
  productsPlaceholder: {
    paddingBottom: 12,
  },
  stockName: {
    paddingBottom: 4,
  },
  productContainer: {
    paddingRight: 32,
    paddingBottom: 8,
  },
});
