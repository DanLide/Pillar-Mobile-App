import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { StatusBadge } from './StatusBadge';
import { GetOrdersAPIResponse } from '../../../data/api';
import { colors, fonts } from '../../../theme';
import { AppNavigator } from '../../../navigation/types';

type Props = ListRenderItemInfo<GetOrdersAPIResponse>;

export const OrdersListItem = ({ item }: Props) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(AppNavigator.OrderDetailsScreen, {
      orderId: item.orderId,
    });
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.orderNumberContainer}>
        <Text style={styles.orderNumberText}>{item.orderId}</Text>
      </View>

      <View style={styles.distributorContainer}>
        <Text style={styles.distributorName}>{item.supplierName}</Text>
      </View>

      <View style={styles.statusContainer}>
        <StatusBadge orderStatusType={item.status} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  },
  distributorName: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.grayDark,
    fontFamily: fonts.TT_Regular,
  },
  statusContainer: {},
});
