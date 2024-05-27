import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const fetchStocks = async () => {
    const stocks = await getFetchStockAPI();
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
      itemRightText={t('receiveHere')}
    />
  );
};
