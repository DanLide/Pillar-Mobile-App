import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
  ListRenderItemInfo,
} from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Button } from '../../components';
import { colors, fonts, SVGs } from '../../theme';

import { removeProductsStore } from './stores';
import { authStore } from '../../stores';

import { AppNavigator } from '../../navigation';

import { ButtonType } from '../../components/Button';

import { groupProductsByJobId } from './helpers';
import { RemoveProductModel } from './stores/RemoveProductsStore';
import { OTHER_JOB_ID } from './constants';
import { useToast } from 'react-native-toast-notifications';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
  ToastType,
} from '../../contexts';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const store = useRef(removeProductsStore).current;
  const toast = useToast();

  const stockName = store.currentStock?.organizationName || '';
  const syncedProductsSections = useMemo(
    () => groupProductsByJobId(store.getSyncedProducts),
    [store.getSyncedProducts],
  );

  const notSyncedProductsSection = useMemo(
    () => groupProductsByJobId(store.getNotSyncedProducts),
    [store.getNotSyncedProducts],
  );

  useEffect(() => {
    if (notSyncedProductsSection.length) {
      toast.show?.(
        'Sorry, some of the products on your list were not removed from inventory',
        { type: ToastType.Error },
      );
    }
  }, [notSyncedProductsSection.length, toast]);

  const onPressLogout = () => {
    authStore.logOut();
  };
  const onReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: AppNavigator.HomeScreen }],
    });
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RemoveProductModel>) => (
      <View style={styles.sectionItemContainer}>
        {item.isRemoved ? null : (
          <SVGs.ExclamationMarkIcon
            color={colors.red}
            style={styles.errorIcon}
          />
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={styles.sectionItemLeft}
        >
          {item.name}
        </Text>
        <Text style={styles.sectionItemRight}>{item.reservedCount}</Text>
      </View>
    ),
    [],
  );

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<RemoveProductModel> }) => (
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

  return (
    <>
      <View style={styles.cabinetContainer}>
        <Text style={styles.cabinetTitle}>{stockName}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.contextTitle}>Remove Complete</Text>
          <Text style={styles.contextBody}>
            You Have successfully removed the following items from{' '}
            <Text style={styles.contextBodyBold}>{stockName}</Text>
          </Text>

          <SectionList
            sections={syncedProductsSections}
            style={styles.list}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
          />

          <Text style={styles.contextFooter}>
            If the products are associated with a job, you will get an email to
            download an invoice. You can also retrieve the invoice in
            RepairStack. These products will also be sent to the associated job
            in CCC.
          </Text>

          {notSyncedProductsSection.length > 0 ? (
            <>
              <Text style={styles.errorListTitle}>
                The following products were not removed
              </Text>
              <SectionList
                sections={notSyncedProductsSection}
                style={styles.list}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
              />
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
});

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
    paddingBottom: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  sectionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginLeft: 16,
    paddingVertical: 8,
  },
  sectionItemLeft: {
    flex: 3,
    color: colors.blackSemiLight,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.TT_Regular,
  },
  sectionItemRight: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'right',
    color: colors.blackSemiLight,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    paddingRight: 30,
  },
  contextFooter: {
    width: '100%',
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 11,
    color: colors.black,
    paddingTop: 8,
    paddingBottom: 16,
    letterSpacing: 0.19,
    fontFamily: fonts.TT_Regular,
    paddingHorizontal: 24,
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
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <ResultScreen {...props} />
  </ToastContextProvider>
);
