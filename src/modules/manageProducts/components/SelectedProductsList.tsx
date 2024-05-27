import { useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
  Text,
} from 'react-native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import {
  ProductEmptyList,
  SelectedProductsListItem,
} from '../../../components';
import { manageProductsStore } from '../stores';
import { colors, fonts } from '../../../theme';

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList: React.FC<Props> = observer(
  ({ onEditProduct }) => {
    const { t } = useTranslation();
    const store = useRef<SyncedProductStoreType>(manageProductsStore).current;

    const products = store.getNotSyncedProducts;

    const ListHeader = useMemo(
      () =>
        products.length > 0 ? (
          <View style={styles.headerTitleContainer}>
            <Text numberOfLines={1} style={styles.headerTitleLeft}>
              {t('recentlyScanned')}
            </Text>
            <Text style={styles.headerTitleRight}>{t('qty')}</Text>
          </View>
        ) : null,
      [products.length],
    );

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => (
        <SelectedProductsListItem
          hideOnHandCount
          item={item}
          onPress={onEditProduct}
        />
      ),
      [onEditProduct],
    );

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ProductEmptyList}
        ListHeaderComponent={ListHeader}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.grayLight,
    paddingVertical: 5,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  headerTitleLeft: {
    color: colors.textNeutral,
    flex: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 19,
  },
  headerTitleRight: {
    color: colors.textNeutral,
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingRight: 35,
  },
});
