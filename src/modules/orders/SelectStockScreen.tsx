import { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';

import { AppNavigator, OrdersParamsList } from 'src/navigation/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { StocksList } from '../stocksList/components/StocksList';
import { ordersStore } from './stores';
import { fetchOrdersStocks } from 'src/data/fetchOrdersStocks';
import { ToastContextProvider } from 'src/contexts';

interface Props {
  navigation: NativeStackNavigationProp<
    OrdersParamsList,
    AppNavigator.SelectStockScreen
  >;
  route: RouteProp<OrdersParamsList, AppNavigator.SelectStockScreen>;
}

const SelectStockScreenBody: React.FC<Props> = observer(
  ({ navigation, route: { params } }) => {
    const store = useRef(ordersStore).current;
    const isFocused = useIsFocused();

    const orderType = params?.orderType;

    useEffect(() => {
      if (isFocused) {
        store.clearCreateOrReceiveBackOrder();
      }
    }, [isFocused, store]);

    const fetchStocks = useCallback(
      (store: StockStore) => fetchOrdersStocks(store),
      [],
    );

    const onItemPress = (stock: StockModel, withoutNavigation?: boolean) => {
      store.setCurrentStocks(stock);
      if (!withoutNavigation) {
        navigation.navigate(AppNavigator.CreateOrderScreen, { orderType });
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <StocksList onFetchStocks={fetchStocks} onPressItem={onItemPress} />
      </SafeAreaView>
    );
  },
);

export const SelectStockScreen: React.FC<Props> = props => {
  return (
    <ToastContextProvider>
      <SelectStockScreenBody {...props} />
    </ToastContextProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  toastStyle: {
    gap: 8,
  },
});
