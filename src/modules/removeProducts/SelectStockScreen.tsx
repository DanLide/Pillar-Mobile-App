import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useTranslation } from 'react-i18next';

import { StocksList } from '../stocksList/components/StocksList';
import { AppNavigator, RemoveStackParamList } from '../../navigation/types';
import { removeProductsStore } from './stores';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';

import { StockProductStoreType, ClearStoreType } from '../../stores/types';
import { ToastContextProvider } from '../../contexts';
import { commonStyles } from 'src/theme';

interface Props {
  route: RouteProp<RemoveStackParamList, AppNavigator.SelectStockScreen>;
  navigation: NativeStackNavigationProp<
    RemoveStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody: React.FC<Props> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const store = useRef<Store>(removeProductsStore).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      store.clear();
    }
  }, [isFocused, store]);

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
      <StocksList onPressItem={onItemPress} />
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
