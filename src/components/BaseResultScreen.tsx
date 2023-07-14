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
import { useToast } from 'react-native-toast-notifications';

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
import { colors, fonts } from '../theme';
import { ResultProductsListItem } from './ResultProductsListItem';
import { OTHER_JOB_ID } from '../constants';
import { Tooltip } from './Tooltip';
import Button, { ButtonType } from './Button';

type ProductsStore = SyncedProductStoreType & StockProductStoreType;

interface Props {
  navigation: BaseResultScreenNavigationProp;
  store: ProductsStore;
  contextTitle?: string;
  contextBody: string;
  errorListTitle: string;
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
    title,
    Header,
  }) => {
    const toast = useToast();

    const stockName = store.currentStock?.organizationName || '';

    const syncedProducts = store.getSyncedProducts;
    const notSyncedProducts = store.getNotSyncedProducts;

    const tooltipMessage = useMemo(
      () => (
        <Text style={styles.tooltipMessage}>
          If the products are associated with a job, you will get an email to
          download an invoice. You can also retrieve the invoice in RepairStack.{' '}
          <Text style={[styles.tooltipMessage, styles.textBold]}>
            These products will also be sent to the associated job in your
            management software.
          </Text>
        </Text>
      ),
      [],
    );

    useEffect(() => {
      if (notSyncedProducts.length) {
        toast.show?.(errorToastMessage, { type: ToastType.Error });
      }
    }, [errorToastMessage, notSyncedProducts.length, toast]);

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
            style={styles.list}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
          />
        ) : (
          <FlatList
            data={syncedProducts}
            style={styles.list}
            renderItem={renderItem}
            ListHeaderComponent={renderSectionHeader}
          />
        ),
      [groupByJob, renderItem, renderSectionHeader, syncedProducts],
    );

    const NotSyncedProductsList = useMemo<JSX.Element>(
      () =>
        groupByJob ? (
          <SectionList
            sections={groupProductsByJobId(notSyncedProducts)}
            style={styles.list}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
          />
        ) : (
          <FlatList
            data={notSyncedProducts}
            style={styles.list}
            renderItem={renderItem}
            ListHeaderComponent={renderSectionHeader}
          />
        ),
      [groupByJob, notSyncedProducts, renderItem, renderSectionHeader],
    );

    const _renderSyncedSectionFooter = () =>
      useMemo(
        () =>
          SyncedSectionFooter ? (
            SyncedSectionFooter
          ) : groupByJob ? (
            <Tooltip
              contentStyle={styles.contextFooter}
              message={tooltipMessage}
            >
              <Text style={styles.contextFooterText}>
                What will be submitted as an invoice?
              </Text>
            </Tooltip>
          ) : null,
        [],
      );

    const _renderHeader = () =>
      useMemo(
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
        [],
      );

    return (
      <>
        <View style={styles.cabinetContainer}>
          <Text style={styles.cabinetTitle}>{title || stockName}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {_renderHeader()}
            {SyncedProductsList}
            {_renderSyncedSectionFooter()}
            {notSyncedProducts.length > 0 ? (
              <>
                <Text style={styles.errorListTitle}>{errorListTitle}</Text>
                {NotSyncedProductsList}
              </>
            ) : null}
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
    alignItems: 'center',
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
  list: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray,
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
    fontSize: 11,
    fontFamily: fonts.TT_Bold,
    lineHeight: 13.5,
    color: colors.black,
    paddingVertical: 8,
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
});

export default (props: Props) => (
  <ToastContextProvider duration={0} offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <BaseResultScreen {...props} />
  </ToastContextProvider>
);
