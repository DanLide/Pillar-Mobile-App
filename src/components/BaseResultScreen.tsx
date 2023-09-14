import React, { useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import { observer } from 'mobx-react';

import {
  ProductModel,
  StockProductStoreType,
  SyncedProductStoreType,
} from '../stores/types';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../contexts';
import { BaseResultScreenNavigationProp } from '../navigation/types';
import { groupProductsByJobId } from '../modules/removeProducts/helpers';
import { ToastType } from '../contexts/types';
import { authStore } from '../stores';
import { colors, fonts, SVGs } from '../theme';
import { ResultProductsListItem } from './ResultProductsListItem';
import { OTHER_JOB_ID } from '../constants';
import { Tooltip } from './Tooltip';
import Button, { ButtonType } from './Button';
import { useSingleToast } from '../hooks';

type ProductsStore = SyncedProductStoreType & StockProductStoreType;

interface Props {
  navigation: BaseResultScreenNavigationProp;
  store: ProductsStore;
  contextTitle?: string;
  contextBody: string;
  errorListTitle: string;
  errorListTitlePartBolt?: string;
  errorToastMessage: string;
  groupByJob?: boolean;
  SyncedSectionFooter?: JSX.Element;
  title?: string;
  Header?: JSX.Element;
}

const BaseResultScreen: React.FC<Props> = observer(
  ({
    navigation,
    store,
    contextTitle,
    contextBody,
    errorListTitle,
    errorToastMessage,
    groupByJob,
    SyncedSectionFooter,
    errorListTitlePartBolt,
    title,
    Header,
  }) => {
    const { showToast } = useSingleToast();

    const stockName = store.currentStock?.organizationName || '';

    const syncedProducts = store.getSyncedProducts;
    const notSyncedProducts = store.getNotSyncedProducts;

    const tooltipMessage = useMemo(
      () => (
        <View style={styles.toolTipContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.dotStyle}>•</Text>
            <Text style={styles.tooltipMessage}>
              {' Your invoice is viewable in '}
              <Text style={[styles.tooltipMessage, styles.textBold]}>
                RepairStack™
              </Text>{' '}
              and/or your integrated Body Shop Management System.
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.dotStyle}>•</Text>
            <Text style={styles.tooltipMessage}>
              {
                ' An email notification has been sent to your shop with a link for the invoice.'
              }
            </Text>
          </View>
        </View>
      ),
      [],
    );

    useEffect(() => {
      if (notSyncedProducts.length) {
        showToast(errorToastMessage, { type: ToastType.Error });
      }
    }, [errorToastMessage, notSyncedProducts.length, showToast]);

    const onPressLogout = () => {
      authStore.logOut();
    };
    const onReturnHome = () => navigation.goBack();

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ProductModel>) => (
        <ResultProductsListItem item={item} />
      ),
      [],
    );

    const renderSectionHeader = useCallback(
      (info: { section?: SectionListData<ProductModel> }) => (
        <View style={styles.sectionTitleContainer}>
          <Text numberOfLines={1} style={styles.sectionTitleLeft}>
            {info.section
              ? info.section.jobId === OTHER_JOB_ID
                ? 'Other'
                : `Job ${info.section.jobId}`
              : 'Product'}
          </Text>
          <Text style={styles.sectionTitleRight}>Qty</Text>
        </View>
      ),
      [],
    );

    const SyncedProductsList = useMemo<JSX.Element>(
      () =>
        groupByJob ? (
          <SectionList
            sections={groupProductsByJobId(syncedProducts)}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
          />
        ) : (
          <FlatList
            data={syncedProducts}
            renderItem={renderItem}
            ListHeaderComponent={renderSectionHeader}
          />
        ),
      [groupByJob, renderItem, renderSectionHeader, syncedProducts],
    );

    const _renderSyncedSectionFooter = useMemo<JSX.Element | null>(
      () =>
        SyncedSectionFooter ? (
          SyncedSectionFooter
        ) : groupByJob ? (
          <Tooltip contentStyle={styles.contextFooter} message={tooltipMessage}>
            <Text style={styles.contextFooterText}>Where’s my Invoice?</Text>
          </Tooltip>
        ) : null,
      [SyncedSectionFooter, groupByJob, tooltipMessage],
    );

    const _renderHeader = useMemo<JSX.Element>(
      () =>
        Header ? (
          Header
        ) : (
          <View style={styles.headerContainer}>
            <Text style={styles.contextTitle}>{contextTitle}</Text>
            <Text style={styles.contextBody}>
              {contextBody}{' '}
              <Text style={styles.contextBodyBold}>{stockName}</Text>
            </Text>
          </View>
        ),
      [Header, contextBody, contextTitle, stockName],
    );

    const renderNotSyncedProduct = useMemo(() => {
      if (!notSyncedProducts.length) {
        return null;
      }

      const List = groupByJob ? (
        <SectionList
          sections={groupProductsByJobId(notSyncedProducts)}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
      ) : (
        <FlatList
          data={notSyncedProducts}
          renderItem={renderItem}
          ListHeaderComponent={renderSectionHeader}
        />
      );

      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorTitleContainer}>
            <SVGs.ErrorProduct />
            <View style={styles.errorTitleWrapper}>
              <Text style={[styles.errorListTitle]}>
                {errorListTitle}
                {!!errorListTitlePartBolt && (
                  <Text style={[styles.errorListTitle, styles.boltText]}>
                    {errorListTitlePartBolt}
                  </Text>
                )}
              </Text>
            </View>
          </View>
          {List}
        </View>
      );
    }, [
      errorListTitle,
      errorListTitlePartBolt,
      groupByJob,
      notSyncedProducts,
      renderItem,
      renderSectionHeader,
    ]);

    return (
      <>
        <View style={styles.cabinetContainer}>
          <Text style={styles.cabinetTitle}>{title || stockName}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {_renderHeader}
            {SyncedProductsList}
            {_renderSyncedSectionFooter}
            {renderNotSyncedProduct}
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              textStyle={styles.buttonText}
              type={ButtonType.secondary}
              title="Logout"
              buttonStyle={styles.logout}
              onPress={onPressLogout}
            />
            <Button
              textStyle={styles.buttonText}
              type={ButtonType.primary}
              title="Return Home"
              buttonStyle={styles.returnHome}
              onPress={onReturnHome}
            />
          </View>
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  cabinetContainer: {
    width: '100%',
    height: 33,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
  },
  cabinetTitle: {
    fontSize: 18,
    lineHeight: 23.5,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
    alignSelf: 'center',
    paddingVertical: 5,
  },
  headerContainer: {
    width: 360,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 8,
  },
  contextTitle: {
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  contextBody: {
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 48,
    paddingBottom: 8,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
  },
  contextBodyBold: {
    fontFamily: fonts.TT_Bold,
  },
  errorContainer: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  errorTitleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  errorTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltText: {
    fontFamily: fonts.TT_Bold,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.grayLight,
    paddingVertical: 4,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  sectionTitleLeft: {
    flex: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingLeft: 16,
  },
  sectionTitleRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    paddingRight: 30,
  },
  errorListTitle: {
    fontSize: 14,
    fontFamily: fonts.TT_Regular,
    lineHeight: 17.5,
    color: colors.black,
    paddingVertical: 8,
  },
  dotStyle: {
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
  },
  tooltipMessage: {
    flex: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    letterSpacing: 0.16,
    textAlign: 'left',
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
  contextFooter: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  contextFooterText: {
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
    fontSize: 12,
    letterSpacing: 0.16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  logout: {
    width: 155,
    height: 48,
  },
  returnHome: {
    width: 171,
    height: 48,
  },
  buttonText: {
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  toolTipContainer: {
    flex: 1,
  },
});

export default (props: Props) => (
  <ToastContextProvider duration={0} offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <BaseResultScreen {...props} />
  </ToastContextProvider>
);
