import React, { useRef } from 'react';
import { observer } from 'mobx-react';

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
  const store = useRef<ProductsStore>(returnProductsStore).current;

  return (
    <BaseResultScreen
      navigation={navigation}
      store={store}
      contextTitle="Return Complete"
      contextBody="You have successfully returned the following items from"
      errorListTitle="The following products were "
      errorListTitlePartBolt="not returned"
      errorToastMessage="Sorry, some of the products on your list were not returned from inventory"
    />
  );
});
