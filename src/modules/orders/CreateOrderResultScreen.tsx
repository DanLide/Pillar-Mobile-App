import { useCallback, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
import { OrderStatusType, OrderType } from 'src/constants/common.enum';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.CreateOrderResultScreen
>;

export const CreateOrderResultScreen = ({
  navigation,
  route: { params },
}: Props) => {
  const { t } = useTranslation();
  const ordersStoreRef = useRef(ordersStore).current;

  const order = ordersStoreRef.currentOrder?.order;
  const orderType = params?.orderType;
  const isPurchaseOrder = orderType === OrderType.Purchase;

  const orderId = order?.orderId;
  const supplierName = order?.supplierName;
  const status = order?.status;
  const poNumber = order?.customPONumber;

  const isPORequired = status === OrderStatusType.POREQUIRED;
  const isOrderNotFinalized = isPORequired && !poNumber;

  const primaryButtonText = isPurchaseOrder ? t('home') : t('manageOrders');
  const secondaryButtonText = isPurchaseOrder ? t('viewOrder') : t('home');

  const title = isPurchaseOrder
    ? t('orderIdCreated', { orderId: orderId ? orderId : '' })
    : t('returnOrderCreated');

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

  const onPrimaryPress = useCallback(
    () =>
      isPurchaseOrder
        ? navigation.goBack()
        : navigation.replace(AppNavigator.OrdersScreen),
    [isPurchaseOrder, navigation],
  );

  const onSecondaryPress = useCallback(
    () =>
      isPurchaseOrder && orderId
        ? navigation.navigate(AppNavigator.OrderDetailsScreen, {
            orderId: orderId.toString(),
          })
        : navigation.goBack(),
    [isPurchaseOrder, navigation, orderId],
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
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.subtitleContainer}>
            {isOrderNotFinalized ? (
              <>
                <Text style={subtitleLargeStyle}>
                  {t('yourOrderIsSavedButNotFinalized')}
                </Text>
                <Text style={subtitleLargeStyle}>
                  {t('loginTo')}{' '}
                  <Text style={styles.subtitleBoldItalic}>
                    repairstack.3m.com
                  </Text>{' '}
                  {t('toAssignOrderToDistributor')}
                </Text>
              </>
            ) : (
              <Text style={styles.subtitle}>
                {t('youHaveSuccessfullySubmittedItems')}
              </Text>
            )}
          </View>

          <View style={styles.distributorAndPOContainer}>
            <View style={styles.distributorAndPOContent}>
              <Text style={styles.distributorAndPOTitle}>
                {t('distributor')}
              </Text>
              <Text numberOfLines={1} style={distributorAndPOTextStyle}>
                {supplierName}
              </Text>
            </View>
            {isPORequired && (
              <View style={styles.distributorAndPOContent}>
                <Text style={poTitleStyle}>{t('purchaseOrderNumber')}</Text>
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
      </View>

      <TotalCostBar orderType={orderType} style={styles.totalCost} />

      <View style={styles.buttons}>
        {isPurchaseOrder && !orderId ? null : (
          <Button
            type={ButtonType.secondary}
            title={secondaryButtonText}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={onSecondaryPress}
          />
        )}
        <Button
          type={ButtonType.primary}
          title={primaryButtonText}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          onPress={onPrimaryPress}
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
