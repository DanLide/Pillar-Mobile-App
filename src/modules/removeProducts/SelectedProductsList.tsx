import React, { useCallback, useRef } from 'react';
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  SectionListData,
  ListRenderItemInfo,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { observer } from 'mobx-react';

import { removeProductsStore } from './stores';
import { groupProductsByJobId } from './helpers';
import { OTHER_JOB_ID } from './constants';
import { colors, fonts } from '../../theme';
import { ProductModel, SyncedProductStoreType } from '../../stores/types';
import { ProductEmptyList } from '../../components';

const { width } = Dimensions.get('window');

interface Props {
  onEditProduct: (item: ProductModel) => void;
}

const keyExtractor = (item: ProductModel): string => item.uuid;

export const SelectedProductsList = observer(({ onEditProduct }: Props) => {
  const store = useRef<SyncedProductStoreType>(removeProductsStore).current;
  const sectionListData = groupProductsByJobId(store.getNotSyncedProducts);

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<ProductModel> }) => (
      <View style={styles.sectionTitleContainer}>
        <Text numberOfLines={1} style={styles.sectionTitleLeft}>
          {info.section.jobId === OTHER_JOB_ID
            ? 'Other'
            : `Job ${info.section.jobId}`}
        </Text>
        <Text style={styles.sectionTitleRight}>Qty</Text>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProductModel>) => (
      <TouchableOpacity
        style={styles.sectionItemContainer}
        onPress={() => onEditProduct(item)}
      >
        <View style={styles.sectionItemLeft}>
          <Text numberOfLines={1} style={styles.itemTitle}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.itemDescription}>
            {item.manufactureCode} {item.partNo} {item.size}
          </Text>
        </View>
        <View style={styles.sectionItemRight}>
          <Text style={styles.reservedCount}>
            {item.reservedCount}
            <Text style={styles.onHand}>/{item.onHand}</Text>
          </Text>
        </View>
        <View style={styles.borderLine} />
      </TouchableOpacity>
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
  sectionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 19,
    paddingVertical: 9.5,
    backgroundColor: colors.white,
  },
  borderLine: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width - 16,
    height: 1,
    backgroundColor: colors.gray,
  },
  sectionItemLeft: {
    flex: 3,
  },
  itemTitle: {
    color: colors.purpleDark,
    fontSize: 15,
    lineHeight: 30,
    fontFamily: fonts.TT_Bold,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
  },
  sectionItemRight: {
    flex: 1,
    alignSelf: 'center',
    color: colors.blackSemiLight,
    paddingRight: 35,
  },
  reservedCount: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Bold,
    textAlign: 'right',
    color: colors.purpleDark,
  },
  onHand: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackSemiLight,
    fontFamily: fonts.TT_Regular,
  },
});
