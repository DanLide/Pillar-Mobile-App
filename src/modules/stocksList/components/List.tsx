import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';

import { Stock } from '../stores/StocksStore';
import { stocksStore } from '../stores';
import { fetchStocks } from '../../../data/fetchStocks';

import { ListItem } from './ListItem';

interface Props {
  onPressItem: (stock: Stock) => void;
}

export const List: React.FC<Props> = ({ onPressItem }) => {
  const [stocks, setStocks] = useState<Stock[]>(stocksStore.getStocks);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFetchStocks = useCallback(async () => {
    setIsLoading(true);
    const error = await fetchStocks(stocksStore);
    setStocks(stocksStore.getStocks);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Loading is Failed!');
  }, [stocksStore]);

  useEffect(() => {
    if (!stocksStore.getStocks.length) {
      onFetchStocks();
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
