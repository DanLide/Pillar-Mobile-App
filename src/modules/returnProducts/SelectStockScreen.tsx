import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { AppNavigator, ReturnStackParamList } from '../../navigation/types';
import { ClearStoreType, StockProductStoreType } from '../../stores/types';
import { StockModel } from '../stocksList/stores/StocksStore';
import { InfoTitleBar, InfoTitleBarType } from '../../components';
import { StocksList } from '../stocksList/components/StocksList';
import { returnProductsStore } from './stores';
import { ToastContextProvider } from '../../contexts';
import { commonStyles } from 'src/theme';

interface Props {
  route: RouteProp<ReturnStackParamList, AppNavigator.SelectStockScreen>;
  navigation: NativeStackNavigationProp<
    ReturnStackParamList,
    AppNavigator.SelectStockScreen
  >;
}

type Store = StockProductStoreType & ClearStoreType;

const SelectStockScreenBody: React.FC<Props> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const store = useRef<Store>(returnProductsStore).current;
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
