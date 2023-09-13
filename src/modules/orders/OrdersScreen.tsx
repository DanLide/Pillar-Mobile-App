import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { observer } from 'mobx-react';

import { OrdersList } from './components/OrdersList';
import { ordersStore } from './stores';
import { fetchOrders } from '../../data/fetchOrders';
import { Button, ButtonType, Input } from '../../components';
import { SVGs, colors, fonts } from '../../theme';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { AppNavigator, OrdersParamsList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.OrdersScreen
  >;
}

export const OrdersScreen = observer(({ navigation }: Props) => {
  const ordersStoreRef = useRef(ordersStore).current;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');

  const onFetchOrders = useCallback(async () => {
    setIsLoading(true);
    const error = await fetchOrders();
    if (error) setIsError(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    onFetchOrders();
  }, [onFetchOrders]);

  const filteredOrders = useMemo(
    () =>
      ordersStoreRef.getOrders?.filter(item =>
        item.orderId.toString().includes(filterValue.toLowerCase()),
      ),
    [filterValue, ordersStoreRef.getOrders],
  );

  const openCreateOrder = useCallback(
    () => navigation.navigate(AppNavigator.SelectStockScreen),
    [navigation],
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.image}>
          <SVGs.JobListErrorIcon />
          <Text style={styles.text}>
            Sorry, there was an issue loading a list of orders.
          </Text>
        </View>
        <Button
          type={ButtonType.secondary}
          title="Retry"
          onPress={onFetchOrders}
          buttonStyle={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          containerStyle={styles.inputContainer}
          style={styles.input}
          placeholder="Search by order or product number"
          rightIcon={SVGs.SearchIcon}
          onChangeText={setFilterValue}
          value={filterValue}
        />
      </View>
      <OrdersList orders={filteredOrders} onPrimaryPress={openCreateOrder} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: { backgroundColor: colors.grayLight },
  input: {
    fontSize: 14,
    lineHeight: 18,
  },
  inputContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 13,
    marginVertical: 18.5,
  },
  loading: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 76,
    paddingTop: 16,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
});
