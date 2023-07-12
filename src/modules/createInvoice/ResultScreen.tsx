import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';

import { BaseResultScreenNavigationProp } from '../../navigation/types';
import { CreateInvoiceStore, createInvoiceStore } from './stores';
import { BaseResultScreen } from '../../components';
import { SVGs, colors, fonts } from '../../theme';

interface Props {
  navigation: BaseResultScreenNavigationProp;
}

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;

  const Footer = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        If the products are associated with a job, you will get an email to
        download an invoice. You can also retrieve the invoice in RepairStack.{' '}
        <Text style={styles.bold}>
          These products will also be sent to the associated job in your
          management software.
        </Text>
      </Text>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.contextTitleContainer}>
        <SVGs.RefundIcon color={colors.black} />
        <Text style={styles.contextTitleText}>Invoice Submitted</Text>
      </View>
      <Text style={styles.headerBody}>
        You have successfully billed the following items to{' '}
        <Text style={styles.bold}>{store.currentJob?.jobNumber}</Text>
      </Text>
    </View>
  );

  return (
    <BaseResultScreen
      navigation={navigation}
      store={store}
      contextBody="You have successfully billed the following items to"
      errorListTitle=""
      errorToastMessage=""
      title={store.currentJob?.jobNumber}
      SyncedSectionFooter={<Footer />}
      Header={<Header />}
    />
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    width: 260,
  },
  headerBody: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: 16,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.black,
  },
  footerContainer: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  footerText: {
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    letterSpacing: 0.16,
    lineHeight: 14.5,
    textAlign: 'left',
  },
  bold: {
    fontFamily: fonts.TT_Bold,
  },
  contextTitleContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  contextTitleText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    paddingLeft: 4,
  },
});
