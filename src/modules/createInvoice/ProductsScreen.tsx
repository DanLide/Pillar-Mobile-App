import React, { memo, useCallback, useRef } from 'react';

import { BaseProductsScreen, BaseSelectedProductsList } from '../../components';
import { BaseProductsScreenNavigationProp } from '../../navigation/types';
import { createInvoiceStore, CreateInvoiceStore } from './stores';
import { ProductModalType } from '../productModal';
import { onCreateInvoice } from '../../data/createInvoice';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ProductsScreen = memo(({ navigation }: Props) => {
  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;

  const onComplete = useCallback(async () => {
    await onCreateInvoice(store);
  }, [store]);

  return (
    <BaseProductsScreen
      infoTitle={store.currentJob?.jobNumber}
      modalType={ProductModalType.CreateInvoice}
      navigation={navigation}
      store={store}
      onComplete={onComplete}
      tooltipTitle="Scan to add products to list"
      ListComponent={BaseSelectedProductsList}
    />
  );
});
