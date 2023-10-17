import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
} from '../../components';
import { SVGs, colors, fonts } from '../../theme';

import { ordersStore } from './stores';
import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { SelectedProductsList } from 'src/modules/orders/components/SelectedProductsList';
import { TotalCostBar } from 'src/modules/orders/components';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.CreateOrderResultScreen
>;

export const CreateOrderResultScreen = ({ navigation }: Props) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const orderId = ordersStoreRef.currentOrder?.order.orderId;

  const onNavigateToHome = useCallback(
    () =>
      navigation.reset({
        routes: [{ name: AppNavigator.Drawer }],
      }),
    [navigation],
  );

  const onNavigateToOrderView = useCallback(
    () =>
      orderId &&
      navigation.navigate(AppNavigator.OrderDetailsScreen, {
        orderId: orderId.toString(),
      }),
    [navigation, orderId],
  );

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={ordersStoreRef.stockName}
      />

      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <SVGs.CheckMark color={colors.green3} />
            <Text style={styles.title}>
              Order {orderId && `${orderId} `}Created
            </Text>
          </View>
          <Text style={styles.subtitle}>
            You have successfully submitted the following items
          </Text>
          <Text style={styles.distributorTitle}>Distributor</Text>
          <Text style={[styles.distributorTitle, styles.distributorText]}>
            {ordersStoreRef.currentOrder?.order.supplierName}
          </Text>
        </View>

        <View style={styles.table}>
          <SelectedProductsList itemTitleColor={colors.grayDark3} />
        </View>

        <Text style={styles.note}>
          Your order will be sent via{'\n'}email and/or EDI to your distributor
        </Text>
      </View>

      <TotalCostBar style={styles.totalCost} />

      <View style={styles.buttons}>
        {orderId && (
          <Button
            type={ButtonType.secondary}
            title="View Order"
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={onNavigateToOrderView}
          />
        )}
        <Button
          type={ButtonType.primary}
          title="Home"
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          onPress={onNavigateToHome}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    padding: 16,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  distributorText: {
    fontFamily: fonts.TT_Bold,
    color: colors.textNeutral,
  },
  distributorTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  infoContainer: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 14,
  },
  note: {
    color: colors.grayText,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 11,
    lineHeight: 14,
    paddingBottom: 15,
    textAlign: 'center',
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral30,
    borderRadius: 8,
  },
  title: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 17,
    lineHeight: 22,
    paddingLeft: 6,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  totalCost: {
    marginTop: 11,
  },
});
