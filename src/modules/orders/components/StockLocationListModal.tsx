import React from 'react';
import { getFetchStockAPI, getFetchStockByDeviceNameAPI } from 'src/data/api';
import { StocksList } from 'src/modules/stocksList/components/StocksList';
import { stocksStore } from 'src/modules/stocksList/stores';
import {
  StockModel,
  StockModelWithMLAccess,
} from 'src/modules/stocksList/stores/StocksStore';
import { ordersStore } from '../stores';

type StockLocationListModalProps = {
  onSelectStock: (stock: StockModel) => void;
};

export const StockLocationListModal: React.FC<StockLocationListModalProps> = ({
  onSelectStock,
}) => {
  const fetchStocks = async () => {
    let stocks: StockModelWithMLAccess[] | undefined = [];
    try {
      stocks = await getFetchStockByDeviceNameAPI();
    } catch (error) {
      stocks = await getFetchStockAPI();
    }
    const productCabinets = ordersStore.backorderCabinets;

    const availableStocks =
      stocks.filter(stock =>
        productCabinets.find(
          cabinet => stock.partyRoleId === cabinet.cabinets?.[0].storageAreaId,
        ),
      ) || [];
    stocksStore.setStocks(availableStocks);
  };

  return (
    <StocksList
      onPressItem={onSelectStock}
      onFetchStocks={fetchStocks}
      skipNavToUnlockScreen
      itemRightText="Receive here"
    />
  );
};
