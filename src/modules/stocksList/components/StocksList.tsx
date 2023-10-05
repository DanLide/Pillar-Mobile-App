import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  ListRenderItem,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';

import { StockModel, StockStore } from '../stores/StocksStore';
import { stocksStore } from '../stores';
import { fetchStocks } from '../../../data/fetchStocks';
import { StocksListItem } from './StocksListItem';
import { colors, SVGs } from '../../../theme';
import { Button, ButtonType } from '../../../components';
import { AuthError, BadRequestError } from '../../../data/helpers/tryFetch';
import masterLockStore from '../../../stores/MasterLockStore';
import { autorun } from 'mobx';
import { RoleType } from '../../../constants/common.enum';

interface Props {
  onPressItem: (stock: StockModel) => void;
  onFetchStocks?: (
    store: StockStore,
  ) => Promise<void | BadRequestError | AuthError>;
}

const keyExtractor = (item: StockModel) => String(item.partyRoleId);
const errorText =
  'Sorry, we are unable to connect to your stock location right now. To continue, you may need to locate a key to unlock the stock location.';

export const StocksList: React.FC<Props> = observer(
  ({ onPressItem, onFetchStocks }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      autorun(() => {
        const initAllStocks = async () => {
          await Promise.all(
            stocksStore.stocks.filter(stock => {
              if (stock.roleTypeId === RoleType.Cabinet) {
                return masterLockStore.initMasterLockForStocks(stock);
              }
            }),
          );
          setIsLoading(false);
        };
        initAllStocks();
      });
    }, []);

    const handleFetchStocks = useCallback(async () => {
      setIsLoading(true);

      const fetchStocksFunction = onFetchStocks ? onFetchStocks : fetchStocks;

      const error = await fetchStocksFunction(stocksStore);

      if (error) {
        setIsError(true);
      }
    }, [onFetchStocks]);

    const renderStockListItem = useCallback<ListRenderItem<StockModel>>(
      ({ item }) => <StocksListItem item={item} onPressItem={onPressItem} />,
      [onPressItem],
    );

    const handlePressRetry = () => {
      handleFetchStocks();
      setIsError(false);
    };

    useEffect(() => {
      handleFetchStocks();
      autorun(() => {
        const setupMasterLock = async () => {
          if (!stocksStore.stocks.length) return;
          const cabinets = stocksStore.stocks.filter(
            stock => stock.roleTypeId === RoleType.Cabinet,
          );

          Promise.all(
            cabinets.map(stock => {
              if (stock.roleTypeId === RoleType.Cabinet) {
                return masterLockStore.initMasterLockForStocks(stock);
              }
            }),
          ).finally(() => {
            setIsLoading(false);
          });
        };
        setupMasterLock();
      });
    }, [handleFetchStocks]);

    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }

    if (isError) {
      return (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <SVGs.StockLocationErrorIcon />
            <Text style={styles.text}>{errorText}</Text>
          </View>
          <Button
            title="Retry"
            type={ButtonType.primary}
            buttonStyle={styles.buttonStyle}
            onPress={handlePressRetry}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={stocksStore.stocks}
        renderItem={renderStockListItem}
        keyExtractor={keyExtractor}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: '100%',
    marginBottom: 16,
  },
  text: {
    marginTop: 24,
    marginHorizontal: 6,
    textAlign: 'center',
    color: colors.grayDark2,
  },
});
