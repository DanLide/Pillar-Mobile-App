import React, { useRef } from 'react';
import { observer } from 'mobx-react';

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
  const store = useRef<ProductsStore>(removeProductsStore).current;

  return (
    <BaseResultScreen
      groupByJob
      navigation={navigation}
      store={store}
      contextTitle="Remove Complete"
      contextBody="You have successfully removed the following items from"
      errorListTitle="The following products were not removed"
      errorToastMessage="Sorry, some of the products on your list were not removed from inventory"
    />
  );
});
