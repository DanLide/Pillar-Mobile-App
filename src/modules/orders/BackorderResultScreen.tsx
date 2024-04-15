import { useCallback, useMemo, useEffect } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { Button, ButtonType, DropdownItem } from '../../components';
import { colors, fonts, SVGs } from '../../theme';

import { ordersStore } from './stores';
import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { SelectedProductsList } from 'src/modules/orders/components/SelectedProductsList';
import { TotalCostBar } from 'src/modules/orders/components';
import { find, whereEq } from 'ramda';
import { stocksStore } from '../stocksList/stores';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.BackOrderResultScreen
>;

export const BackOrderResultScreen = ({ navigation }: Props) => {
  const order = ordersStore.currentOrder?.order;

  const orderId = order?.orderId;
  const supplier = useMemo<DropdownItem | undefined>(
    () =>
      find(
        whereEq({ value: ordersStore.supplierId }),
        stocksStore.suppliersRenderFormat,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      ordersStore.clearCreateOrReceiveBackOrder();
    };
  }, []);

  const distributorAndPOTextStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.distributorAndPOTitle, styles.distributorAndPOText],
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
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <SVGs.CheckMark color={colors.green3} />
            <Text style={styles.title}>Products Received</Text>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              You have successfully submixtted the following items
            </Text>
          </View>

          <View style={styles.distributorAndPOContainer}>
            <View style={styles.distributorAndPOContent}>
              <Text style={styles.distributorAndPOTitle}>Distributor</Text>
              <Text numberOfLines={1} style={distributorAndPOTextStyle}>
                {supplier.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <SelectedProductsList itemTitleColor={colors.grayDark3} />
        </View>
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
    overflow: 'hidden',
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
