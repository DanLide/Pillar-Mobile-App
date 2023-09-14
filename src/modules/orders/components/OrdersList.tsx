import React from 'react';
import { FlatList, StyleSheet, View, Text, Pressable } from 'react-native';

import { GetOrdersAPIResponse } from '../../../data/api';
import { OrdersListItem } from './OrdersListItem';
import { SVGs, colors, fonts } from '../../../theme';
import { Button, ButtonType } from '../../../components';

interface Props {
  orders?: GetOrdersAPIResponse[];
  onPrimaryPress?: () => void;
}

export const OrdersList: React.FC<Props> = ({ orders, onPrimaryPress }) => {
  const ItemSeparator = () => <View style={styles.separator} />;

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
        renderItem={item => <OrdersListItem {...item} />}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Pressable style={styles.backorderContainer}>
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
};

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
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
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
