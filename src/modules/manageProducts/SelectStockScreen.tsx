import { useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  AppNavigator,
  ManageProductsStackParamList,
} from '../../navigation/types';
import { ClearStoreType, StockProductStoreType } from '../../stores/types';
import { StockModel, StockStore } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';
import { StocksList } from '../stocksList/components/StocksList';
import { manageProductsStore } from './stores';
import { fetchManageProductsStocks } from '../../data/fetchManageProductStocks';
import { ToastContextProvider } from '../../contexts';
import { commonStyles } from 'src/theme';

interface Props {
  route: RouteProp<
    ManageProductsStackParamList,
    AppNavigator.SelectStockScreen
  >;
  navigation: NativeStackNavigationProp<
    ManageProductsStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody = observer(({ navigation }: Props) => {
  const { t } = useTranslation();
  const store = useRef<Store>(manageProductsStore).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      store.clear();
    }
  }, [isFocused, store]);

  const fetchStocks = useCallback(
    (store: StockStore) => fetchManageProductsStocks(store),
    [],
  );

  const onItemPress = (stock: StockModel, withoutNavigation?: boolean) => {
    store.setCurrentStocks(stock);
    if (!withoutNavigation) {
      navigation.navigate(AppNavigator.ScannerScreen);
    }
  };

  return (
    <SafeAreaView style={commonStyles.flex1}>
      <InfoTitleBar
        type={InfoTitleBarType.Secondary}
        title={t('selectStockLocation')}
      />
      <StocksList onFetchStocks={fetchStocks} onPressItem={onItemPress} />
    </SafeAreaView>
  );
});

export const SelectStockScreen: React.FC<Props> = props => {
  return (
    <ToastContextProvider>
      <SelectStockScreenBody {...props} />
    </ToastContextProvider>
  );
};
