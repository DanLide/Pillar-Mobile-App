import { useRef } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseResultScreenNavigationProp } from '../../navigation/types';
import { returnProductsStore } from './stores';
import { BaseResultScreen } from '../../components';

interface Props {
  navigation: BaseResultScreenNavigationProp;
}

type ProductsStore = SyncedProductStoreType & StockProductStoreType;

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const store = useRef<ProductsStore>(returnProductsStore).current;

  return (
    <BaseResultScreen
      navigation={navigation}
      store={store}
      contextTitle={t('returnComplete')}
      contextBody={t('youHaveSuccessfullyReturnedItems')}
      errorListTitle={t('followingProductsWere')}
      errorListTitlePartBolt={t('notReturned')}
      errorToastMessage={t('sorrySomeProductsWereNotReturned')}
    />
  );
});
