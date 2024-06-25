import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseProductsScreen, BaseSelectedProductsList } from '../../components';
import { BaseProductsScreenNavigationProp } from 'src/navigation/types';
import { createInvoiceStore, CreateInvoiceStore } from './stores';
import { ProductModalType } from '../productModal';
import { onCreateInvoice } from 'src/data/createInvoice';
import { useBaseProductsScreen } from 'src/hooks';
import { observer } from 'mobx-react';
import { Flows } from '../types';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ProductsScreen = observer(({ navigation }: Props) => {
  const { t } = useTranslation();

  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;
  const {
    modalParams,
    product,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(store, navigation, ProductModalType.CreateInvoice);

  const onComplete = useCallback(() => {
    return onCreateInvoice(store);
  }, [store]);

  return (
    <>
      <BaseProductsScreen
        modalParams={modalParams}
        product={product}
        scannedProductsCount={scannedProductsCount}
        onPressScan={onPressScan}
        onProductListItemPress={onProductListItemPress}
        onSubmitProduct={onSubmitProduct}
        setEditableProductQuantity={setEditableProductQuantity}
        onRemoveProduct={onRemoveProduct}
        onCloseModal={onCloseModal}
        infoTitle={store.currentJob?.jobNumber}
        navigation={navigation}
        store={store}
        onComplete={onComplete}
        tooltipTitle={t('scanToAddProductsToList')}
        primaryButtonTitle={t('submit')}
        ListComponent={BaseSelectedProductsList}
        flow={Flows.CreateInvoice}
      />
    </>
  );
});
