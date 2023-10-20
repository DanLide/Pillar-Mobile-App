import React, { useCallback, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
} from '../../components';
import { colors, fonts, SVGs } from '../../theme';

import { ordersStore } from './stores';
import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { SelectedProductsList } from 'src/modules/orders/components/SelectedProductsList';
import { TotalCostBar } from 'src/modules/orders/components';
import { OrderStatusType } from 'src/constants/common.enum';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.CreateOrderResultScreen
>;

export const CreateOrderResultScreen = ({ navigation }: Props) => {
  const ordersStoreRef = useRef(ordersStore).current;

  const order = ordersStoreRef.currentOrder?.order;

  const orderId = order?.orderId;
  const supplierName = order?.supplierName;
  const status = order?.status;
  const poNumber = order?.customPONumber;

  const isPORequired = status === OrderStatusType.POREQUIRED;
  const isOrderNotFinalized = isPORequired && !poNumber;

  const TitleIcon = useMemo(
    () =>
      isOrderNotFinalized ? (
        <SVGs.CautionMiddleIcon />
      ) : (
        <SVGs.CheckMark color={colors.green3} />
      ),
    [isOrderNotFinalized],
  );

  const distributorAndPOTextStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.distributorAndPOTitle, styles.distributorAndPOText],
    [],
  );

  const poTitleStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.distributorAndPOTitle, styles.poTitle],
    [],
  );

  const poTextStyle = useMemo<StyleProp<TextStyle>>(
    () => [poTitleStyle, styles.distributorAndPOText],
    [poTitleStyle],
  );

  const subtitleLargeStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.subtitle, styles.subtitleLarge],
    [],
  );

  const onNavigateToHome = useCallback(() => navigation.goBack(), [navigation]);

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
            {TitleIcon}
            <Text style={styles.title}>
              Order {orderId && `${orderId} `}Created
            </Text>
          </View>

          <View style={styles.subtitleContainer}>
            {isOrderNotFinalized ? (
              <>
                <Text style={subtitleLargeStyle}>
                  Your order is saved, but not finalized.
                </Text>
                <Text style={subtitleLargeStyle}>
                  Login to{' '}
                  <Text style={styles.subtitleBoldItalic}>
                    repairstack.3m.com
                  </Text>{' '}
                  to assign{'\n'}PO and release order to you Distributor
                </Text>
              </>
            ) : (
              <Text style={styles.subtitle}>
                You have successfully submitted the following items
              </Text>
            )}
          </View>

          <View style={styles.distributorAndPOContainer}>
            <View style={styles.distributorAndPOContent}>
              <Text style={styles.distributorAndPOTitle}>Distributor</Text>
              <Text numberOfLines={1} style={distributorAndPOTextStyle}>
                {supplierName}
              </Text>
            </View>
            {isPORequired && (
              <View style={styles.distributorAndPOContent}>
                <Text style={poTitleStyle}>Purchase Order Number</Text>
                <Text style={poTextStyle} numberOfLines={1}>
                  {poNumber ?? <Text style={styles.poPlaceholder}>---</Text>}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <SelectedProductsList itemTitleColor={colors.grayDark3} />
        </View>

        {!isPORequired && (
          <Text style={styles.note}>
            Your order will be sent via{'\n'}email and/or EDI to your
            distributor
          </Text>
        )}
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
  distributorAndPOContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  distributorAndPOContent: {
    flex: 1,
  },
  distributorAndPOText: {
    fontFamily: fonts.TT_Bold,
    color: colors.textNeutral,
  },
  distributorAndPOTitle: {
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
  poTitle: {
    textAlign: 'right',
  },
  poPlaceholder: {
    color: colors.orange,
  },
  subtitle: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  subtitleBoldItalic: {
    fontFamily: fonts.TT_BoldItalic,
  },
  subtitleContainer: {
    gap: 8,
    paddingBottom: 15,
  },
  subtitleLarge: {
    fontSize: 14,
    lineHeight: 18,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral30,
    borderRadius: 8,
  },
  title: {
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
    paddingLeft: 8,
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
