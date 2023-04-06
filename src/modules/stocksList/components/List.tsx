import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';

import { Stock } from '../stores/StocksStore';
import { getStores } from '../../../data/getStocks';
import { stocksStore } from '../stores';

import { ListItem } from './ListItem';

interface Props {
  onPressItem: (stock: Stock) => void;
}

export const List: React.FC<Props> = ({ onPressItem }) => {
  const [stocks, setStocks] = useState<Stock[]>(stocksStore.getStocks);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getStocks = useCallback(async () => {
    setIsLoading(true);
    const error = await getStores(stocksStore);
    setStocks(stocksStore.getStocks);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Loading is Failed!');
  }, [stocksStore]);

  useEffect(() => {
    if (!stocksStore.getStocks.length) {
      getStocks();
    }
  }, [stocksStore.getStocks]);

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
