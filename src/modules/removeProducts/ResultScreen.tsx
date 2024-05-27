import { useRef } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  StockProductStoreType,
  SyncedProductStoreType,
} from '../../stores/types';
import { BaseResultScreenNavigationProp } from '../../navigation/types';
import { removeProductsStore } from './stores';
import { BaseResultScreen } from '../../components';

interface Props {
  navigation: BaseResultScreenNavigationProp;
}

type ProductsStore = SyncedProductStoreType & StockProductStoreType;

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const store = useRef<ProductsStore>(removeProductsStore).current;

  return (
    <BaseResultScreen
      groupByJob
      navigation={navigation}
      store={store}
      contextTitle={t('removeComplete')}
      contextBody={t('youHaveSuccessfullyRemovedItemsFrom')}
      errorListTitle={t('followingProductsWere')}
      errorListTitlePartBolt={t('notRemoved')}
      errorToastMessage={t('sorrySomeProductsWereNotRemoved')}
    />
  );
});
