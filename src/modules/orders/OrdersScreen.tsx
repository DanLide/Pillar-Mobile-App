import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';

import { OrdersList } from './components/OrdersList';
import { ordersStore } from './stores';
import { fetchOrders } from 'src/data/fetchOrders';
import { Button, ButtonType, Input } from '../../components';
import { SVGs, colors, fonts } from '../../theme';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { getScreenName } from 'src/navigation/helpers/getScreenName';
import permissionStore from '../permissions/stores/PermissionStore';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.OrdersScreen
  >;
}

export const OrdersScreen = observer(({ navigation }: Props) => {
  const isFocused = useIsFocused();
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
    if (isFocused) {
      onFetchOrders();
    }
  }, [onFetchOrders, isFocused]);

  const onRightIconPress = () => {
    if (filterValue) {
      setFilterValue('');
    }
  };

  const openCreateOrder = () => {
    const navigateToScreen = getScreenName(permissionStore);
    navigation.navigate(navigateToScreen);
  };

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
          rightIcon={filterValue ? SVGs.CloseIcon : SVGs.SearchIcon}
          onChangeText={setFilterValue}
          value={filterValue}
          onRightIconPress={onRightIconPress}
        />
      </View>
      <OrdersList
        isFiltered={!!filterValue}
        orders={ordersStoreRef.getFilteredOrders(filterValue)}
        onPrimaryPress={openCreateOrder}
        setFetchError={setIsError}
      />
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