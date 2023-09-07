import React, { useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ListRenderItemInfo,
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
import { OrderProductResponse } from '../../data/api/orders';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.OrderByStockLocationScreen
>;
export const OrderByStockLocationScreen = ({ navigation }: Props) => {
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

  const renderItem = ({ item }: ListRenderItemInfo<OrderProductResponse>) => (
    <View style={styles.item}>
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
        +{item.receivedQty > 0 ? item.receivedQty : item.shippedQty}
      </Text>
    </View>
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

  const onReceive = () => {
    // open modal
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
