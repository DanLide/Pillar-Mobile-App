import { useCallback, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { BaseProductsScreen } from 'src/components';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModalType } from '../productModal';
import { ProductModal, SelectedProductsList } from './components';
import { useManageProducts } from 'src/modules/manageProducts/hooks';
import { useBaseProductsScreen } from 'src/hooks';
import { observer } from 'mobx-react';
import { manageProductsStore } from 'src/modules/manageProducts/stores';
import { Flows } from 'src/modules/types';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ManageProductsScreen = observer(({ navigation }: Props) => {
  const { t } = useTranslation();
  const store = useRef(manageProductsStore).current;

  const {
    modalParams,
    product,
    onProductListItemPress,
    onCloseModal,
    onEditPress,
    onCancelPress,
    onSubmit,
  } = useManageProducts(store);

  const {
    scannedProductsCount,
    onPressScan,
    onRemoveProduct,
    setEditableProductQuantity,
  } = useBaseProductsScreen(store, navigation, ProductModalType.ManageProduct);

  const handleHomePress = useCallback(
    () =>
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: AppNavigator.HomeStack }],
        }),
      ),
    [navigation],
  );

  return (
    <BaseProductsScreen
      modalParams={modalParams}
      product={product}
      navigation={navigation}
      store={store}
      tooltipTitle={t('scanToFindProducts')}
      primaryButtonTitle={t('home')}
      onComplete={handleHomePress}
      ProductModalComponent={ProductModal}
      ListComponent={SelectedProductsList}
      onProductListItemPress={onProductListItemPress}
      onCloseModal={onCloseModal}
      onPressScan={onPressScan}
      onRemoveProduct={onRemoveProduct}
      onSubmitProduct={onSubmit}
      scannedProductsCount={scannedProductsCount}
      setEditableProductQuantity={setEditableProductQuantity}
      onEditPress={onEditPress}
      onCancelPress={onCancelPress}
      flow={Flows.ManageProduct}
    />
  );
});
