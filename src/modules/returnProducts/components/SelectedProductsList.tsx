import { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
  ListRenderItemInfo,
} from 'react-native';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { ProductModel, SyncedProductStoreType } from '../../../stores/types';
import { returnProductsStore } from '../stores';
import { groupProductsByJobId } from 'src/helpers';
import {
  ProductEmptyList,
  SelectedProductsListItem,
} from '../../../components';
import { OTHER_JOB_ID } from 'src/constants';
import { colors, fonts } from 'src/theme';

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList: React.FC<Props> = observer(
  ({ onEditProduct }) => {
    const { t } = useTranslation();
    const store = useRef<SyncedProductStoreType>(returnProductsStore).current;
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
  },
);

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
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
});
