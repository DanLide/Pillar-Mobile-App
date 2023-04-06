import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';

import { StockModel } from '../stores/StocksStore';
import { stocksStore } from '../stores';
import { fetchStocks } from '../../../data/fetchStocks';

import { StocksListItem } from './StocksListItem';

interface Props {
  onPressItem: (stock: StockModel) => void;
}

export const StocksList: React.FC<Props> = observer(({ onPressItem }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFetchStocks = useCallback(async () => {
    setIsLoading(true);
    const error = await fetchStocks(stocksStore);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Loading is Failed!');
  }, []);

  useEffect(() => {
    onFetchStocks();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={stocksStore.stocks}
      renderItem={item => StocksListItem({ ...item, onPressItem })}
    />
  );
});
