import { useCallback, useRef } from 'react';
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  SectionListData,
  ListRenderItemInfo,
} from 'react-native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { removeProductsStore } from './stores';
import { groupProductsByJobId } from 'src/helpers';
import { colors, fonts } from '../../theme';
import { ProductModel, SyncedProductStoreType } from '../../stores/types';
import { ProductEmptyList, SelectedProductsListItem } from '../../components';
import { OTHER_JOB_ID } from '../../constants';

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList = observer(({ onEditProduct }: Props) => {
  const { t } = useTranslation();
  const store = useRef<SyncedProductStoreType>(removeProductsStore).current;
  const sectionListData = groupProductsByJobId(store.getNotSyncedProducts);

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<ProductModel> }) => (
      <View style={styles.sectionTitleContainer}>
        <Text numberOfLines={1} style={styles.sectionTitleLeft}>
          {info.section.jobId === OTHER_JOB_ID
            ? t('other')
            : t('roNumber', { id: info.section.jobId })}
        </Text>
        <Text style={styles.sectionTitleRight}>{t('qty')}</Text>
      </View>
    ),
    [t],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProductModel>) => (
      <SelectedProductsListItem item={item} onPress={onEditProduct} />
    ),
    [onEditProduct],
  );

  return (
    <SectionList
      contentContainerStyle={styles.container}
      sections={sectionListData}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ProductEmptyList}
    />
  );
});

const styles = StyleSheet.create({
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.transparent,
    paddingVertical: 5,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  sectionTitleLeft: {
    flex: 3,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 19,
  },
  sectionTitleRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.TT_Bold,
    paddingRight: 35,
  },
  container: {
    flexGrow: 1,
  },
});
