import { useState, useCallback, memo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { GetOrdersAPIResponse } from 'src/data/api';
import { OrdersListItem } from './OrdersListItem';
import { SVGs, colors, commonStyles, fonts } from 'src/theme';
import { ButtonCluster, Separator } from 'src/components';
import { fetchOrders } from 'src/data/fetchOrders';
import { AppNavigator } from 'src/navigation/types';
import { getScreenName } from 'src/navigation/helpers/getScreenName';
import permissionStore from '../../permissions/stores/PermissionStore';
import { permissionProvider } from 'src/data/providers';

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
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const { userPermissions } = permissionProvider;

    const onFetchOrders = useCallback(async () => {
      setIsLoading(true);
      const error = await fetchOrders();
      if (error) setFetchError(true);
      setIsLoading(false);
    }, [setFetchError]);

    const onPressBackorder = () => {
      const routeName = getScreenName(permissionStore);

      if (routeName === AppNavigator.SelectStockScreen) {
        return navigation.navigate(AppNavigator.ReceiveBackorderScreen);
      }

      navigation.navigate(AppNavigator.BluetoothPermissionScreen, {
        nextRoute: AppNavigator.ReceiveBackorderScreen,
      });
    };

    return (
      <View style={commonStyles.flex1}>
        <View style={styles.header}>
          <Text style={[styles.headerOrderId, styles.headerText]}>
            {t('order')}
          </Text>
          <Text style={[commonStyles.flex1, styles.headerText]}>
            {t('distributor')}
          </Text>
          <Text style={styles.headerText}>{t('status')}</Text>
        </View>
        <FlatList
          style={commonStyles.flex1}
          data={orders}
          renderItem={item => (
            <OrdersListItem {...item} isFiltered={isFiltered} />
          )}
          ItemSeparatorComponent={Separator}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onFetchOrders} />
          }
        />

        {userPermissions.receiveOrder && (
          <Pressable
            style={styles.backorderContainer}
            onPress={onPressBackorder}
          >
            <SVGs.ReceiveBackorderIcon color={colors.purpleDark} />
            <Text style={styles.backborderText}>
              {t('orderNotFoundReceiveBackorder')}
            </Text>
          </Pressable>
        )}

        {userPermissions.createOrder && (
          <ButtonCluster
            leftTitle={t('returnOrder')}
            leftOnPress={onSecondaryPress}
            rightTitle={t('createOrderShort')}
            rightOnPress={onPrimaryPress}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
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
    padding: 16,
  },
  backborderText: {
    fontFamily: fonts.TT_Bold,
    color: colors.purpleDark3,
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 8,
  },
});
