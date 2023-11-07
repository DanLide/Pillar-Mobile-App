import React, { useState, useCallback, memo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GetOrdersAPIResponse } from 'src/data/api';
import { OrdersListItem } from './OrdersListItem';
import { SVGs, colors, fonts } from 'src/theme';
import { Button, ButtonType, Separator } from 'src/components';
import { fetchOrders } from 'src/data/fetchOrders';
import { AppNavigator } from 'src/navigation/types';

interface Props {
  orders?: GetOrdersAPIResponse[];
  isFiltered: boolean;

  setFetchError: (errorStatus: boolean) => void;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const OrdersList = memo(
  ({
    orders,
    onPrimaryPress,
    onSecondaryPress,
    setFetchError,
    isFiltered,
  }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const onFetchOrders = useCallback(async () => {
      setIsLoading(true);
      const error = await fetchOrders();
      if (error) setFetchError(true);
      setIsLoading(false);
    }, [setFetchError]);

    const onPressBackorder = () => {
      navigation.navigate(AppNavigator.ReceiveBackorderScreen);
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerOrderId, styles.headerText]}>Order</Text>
          <Text style={[styles.headerDistributor, styles.headerText]}>
            Distributor
          </Text>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <FlatList
          style={styles.container}
          data={orders}
          renderItem={item => (
            <OrdersListItem {...item} isFiltered={isFiltered} />
          )}
          ItemSeparatorComponent={Separator}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onFetchOrders} />
          }
        />
        <Pressable style={styles.backorderContainer} onPress={onPressBackorder}>
          <SVGs.ReceiveBackorderIcon color={colors.purpleDark} />
          <Text style={styles.backborderText}>
            Order not Found? Receive Backorder
          </Text>
        </Pressable>

        <View style={styles.buttons}>
          <Button
            type={ButtonType.secondary}
            title="Return Order"
            buttonStyle={[styles.button, styles.returnButton]}
            textStyle={styles.buttonText}
            onPress={onSecondaryPress}
          />
          <Button
            type={ButtonType.primary}
            title="Create Order"
            buttonStyle={[styles.button, styles.createButton]}
            textStyle={styles.buttonText}
            onPress={onPrimaryPress}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerOrderId: {
    minWidth: '20%',
    paddingLeft: 8,
  },
  headerDistributor: {
    flex: 1,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark2,
  },
  backorderContainer: {
    backgroundColor: colors.grayLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backborderText: {
    fontFamily: fonts.TT_Bold,
    color: colors.purpleDark3,
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  button: {
    flex: 1,
  },
  returnButton: {
    marginLeft: 16,
    marginRight: 8,
  },
  createButton: {
    marginRight: 16,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 30,
  },
});
