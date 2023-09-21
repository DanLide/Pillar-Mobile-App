import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
} from '../../components';
import { SVGs, colors, fonts } from '../../theme';

import { ordersStore } from './stores';
import { OrderProductResponse } from '../../data/api/orders';
import { getScreenOptions } from '../../navigation/helpers';
import {
  AppNavigator,
  LeftBarType,
  OrdersParamsList,
} from '../../navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.ResultScreen
>;

export const ResultScreen = ({ navigation }: Props) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const renderItem = ({ item }: ListRenderItemInfo<OrderProductResponse>) => {
    if (item.orderedQty - item.receivedQty === 0) return null;
    return (
      <View style={styles.item}>
        <View style={styles.description}>
          <Text style={styles.itemName}> {item.name}</Text>
          <Text style={styles.itemSize}> {item.size}</Text>
        </View>
        <View style={styles.quantity}>
          <Text style={styles.itemName}>{item.receivedQty}</Text>
          <Text style={styles.ordered}>/{item.orderedQty}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (ordersStoreRef.currentOrder?.order.orderId) {
      navigation.setOptions(
        getScreenOptions({
          title: `Receive Order ${ordersStoreRef.currentOrder?.order.orderId}`,
          leftBarButtonType: LeftBarType.Back,
        }) as Partial<NativeStackNavigationEventMap>,
      );
    }
  }, [ordersStoreRef, navigation]);

  const onNavigateToHome = () => {
    navigation.reset({
      routes: [{ name: AppNavigator.Drawer }],
    });
  };

  const onNavigateToOrderView = () => {
    navigation.pop(2);
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={ordersStoreRef.currentOrder?.order.orderArea}
      />

      <View style={styles.titleContainer}>
        <SVGs.CheckMark color={colors.green3} />
        <Text style={styles.title}>
          Order {ordersStoreRef.currentOrder?.order.orderId} Received
        </Text>
      </View>
      <Text style={styles.subtitle}>
        You have successfully submitted the following items
      </Text>
      <Text style={styles.distributorTitle}>Distributor</Text>
      <Text style={[styles.distributorTitle, styles.distributorText]}>
        {ordersStoreRef.currentOrder?.order.supplierName}
      </Text>

      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={[styles.headerText, styles.headerLeft]}>Product</Text>
          <Text style={[styles.headerRight, styles.headerText]}>
            Received/Ordered
          </Text>
        </View>
        <FlatList
          style={styles.flatList}
          data={ordersStoreRef.currentOrder?.productList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {ordersStoreRef.isProductItemsMissing ? (
        <>
          <View style={styles.titleContainer}>
            <SVGs.Warning color={colors.black} />
            <Text style={styles.title}>Items Missing</Text>
          </View>
          <Text style={[styles.subtitle, styles.noBottomPadding]}>
            Order is incomplete.
          </Text>
          <Text style={[styles.subtitle, styles.noBottomPadding]}>
            If items arrive later on, update this order.
          </Text>
        </>
      ) : null}

      <View style={styles.buttons}>
        <Button
          type={ButtonType.secondary}
          title="View Order"
          buttonStyle={[styles.button, styles.viewOrderButton]}
          textStyle={styles.buttonText}
          onPress={onNavigateToOrderView}
        />
        <Button
          type={ButtonType.primary}
          title="Home"
          buttonStyle={[styles.button, styles.homeButton]}
          textStyle={styles.buttonText}
          onPress={onNavigateToHome}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingLeft: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
    paddingBottom: 16,
  },
  distributorTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
    paddingHorizontal: 16,
  },
  distributorText: {
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  flatList: {
    borderBottomEndRadius: 8,
    borderBottomLeftRadius: 8,
  },
  separator: {
    height: 1,
    width: '95%',
    marginLeft: 'auto',
    backgroundColor: colors.neutral30,
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
    lineHeight: 22,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  itemSize: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral30,
    borderRadius: 8,
    margin: 8,
  },
  headerLeft: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  button: {
    flex: 1,
  },
  homeButton: {
    marginRight: 16,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 30,
  },
  viewOrderButton: {
    marginLeft: 16,
    marginRight: 8,
  },
  noBottomPadding: {
    paddingBottom: 0,
    paddingVertical: 0,
  },
  boltedText: {
    fontSize: 20,
  },
  ordered: {
    fontSize: 10,
    paddingBottom: 2,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
