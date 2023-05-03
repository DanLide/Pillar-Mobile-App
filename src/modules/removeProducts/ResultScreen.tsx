import React, { useRef, useCallback, useMemo } from 'react';
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
import { colors, fonts } from '../../theme';

import { removeProductsStore } from './stores';
import { authStore } from '../../stores';

import { AppNavigator } from '../../navigation';

import { ButtonType } from '../../components/Button';

import { toSectionListData } from './helpers';
import { RemoveProductModel } from './stores/RemoveProductsStore';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const store = useRef(removeProductsStore).current;

  const stockName = store.currentStock?.organizationName || '';
  const sections = useMemo(
    () => toSectionListData(store.getRemovedProducts),
    [store.get],
  );

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
        <Text numberOfLines={1} style={styles.sectionItemLeft}>
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
          {info.section.title === '-1' ? 'Other' : `Job ${info.section.title}`}
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
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          paddingHorizontal: 10,
          paddingBottom: 24,
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.contextTitle}>Remove Complete</Text>
          <Text style={styles.contextBody}>
            You Have successfully removed the following items from{' '}
            <Text style={styles.contextBodyBold}>{stockName}</Text>
          </Text>

          <SectionList
            sections={sections}
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
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            type={ButtonType.secondary}
            title="Logout"
            buttonStyle={styles.logout}
            onPress={onPressLogout}
          />
          <Button
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
  },
  contextTitle: {
    paddingTop: 19,
    paddingBottom: 9.5,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  contextBody: {
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 26,
    paddingBottom: 10,
    fontSize: 13,
    lineHeight: 15.5,
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
  sectionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginLeft: 19,
    paddingVertical: 9.5,
  },
  sectionItemLeft: {
    flex: 3,
    color: colors.blackSemiLight,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.TT_Regular,
  },
  sectionItemRight: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'right',
    color: colors.blackSemiLight,
    fontSize: 15.5,
    lineHeight: 21,
    fontFamily: fonts.TT_Regular,
    paddingRight: 35,
  },
  contextFooter: {
    width: '100%',
    textAlign: 'center',
    fontSize: 10.5,
    lineHeight: 13,
    color: colors.black,
    paddingTop: 9.5,
    paddingBottom: 21,
    letterSpacing: 0.19,
    fontFamily: fonts.TT_Regular,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logout: {
    width: 135,
    height: 56,
  },
  returnHome: {
    width: 210,
    height: 56,
  },
});
