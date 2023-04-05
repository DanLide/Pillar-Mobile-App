import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';

import { Stock } from '../stores/StocksStore';
import { getStores } from '../../../data/getStores';
import { stockStore } from '../stores';
import { authStore } from '../../../stores';

import { ListItem } from './ListItem';

interface Props {
  onPressItem: (stock: Stock) => void;
}

export const List: React.FC<Props> = ({ onPressItem }) => {
  const [stocks, setStocks] = useState<Stock[]>(stockStore.getStocks);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getStocks = useCallback(async () => {
    setIsLoading(true);
    const error = await getStores(authStore, stockStore);
    setStocks(stockStore.getStocks);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Loading is Failed!');
  }, [authStore, stockStore]);

  useEffect(() => {
    if (!stockStore.getStocks.length) {
      getStocks();
    }
  }, [stockStore.getStocks]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={stocks}
      renderItem={item => ListItem({ ...item, onPressItem })}
    />
  );
};
