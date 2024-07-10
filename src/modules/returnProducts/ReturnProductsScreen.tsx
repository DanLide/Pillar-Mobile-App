import { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  StockProductStoreType,
  SyncedProductStoreType,
} from 'src/stores/types';
import { BaseProductsScreen } from 'src/components';
import { BaseProductsScreenNavigationProp } from 'src/navigation/types';
import { returnProductsStore } from './stores';
import { ProductModalType } from '../productModal';
import { SelectedProductsList } from './components';
import { onReturnProducts } from 'src/data/returnProducts';
import { useBaseProductsScreen } from 'src/hooks';
import { Flows } from 'src/modules/types';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

type Store = ScannerModalStoreType &
  CurrentProductStoreType &
  SyncedProductStoreType &
  StockProductStoreType;

export const ReturnProductsScreen = observer(({ navigation }: Props) => {
  const { t } = useTranslation();
  const store = useRef<Store>(returnProductsStore).current;

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
  } = useBaseProductsScreen(store, navigation, ProductModalType.Return);

  const onCompleteReturn = useCallback(async () => {
    await onReturnProducts(returnProductsStore);
  }, []);

  return (
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
      navigation={navigation}
      store={store}
      tooltipTitle={t('scanToAddProductsToList')}
      onComplete={onCompleteReturn}
      ListComponent={SelectedProductsList}
      flow={Flows.Return}
    />
  );
});
