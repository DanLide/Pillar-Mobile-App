import { useRef } from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BaseResultScreenNavigationProp } from '../../navigation/types';
import { CreateInvoiceStore, createInvoiceStore } from './stores';
import { BaseResultScreen } from '../../components';
import { SVGs, colors, fonts } from '../../theme';

interface Props {
  navigation: BaseResultScreenNavigationProp;
}

export const ResultScreen: React.FC<Props> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.contextTitleContainer}>
        <SVGs.RefundIcon color={colors.black} />
        <Text style={styles.contextTitleText}>{t('invoiceCreated')}</Text>
      </View>
      <Text style={styles.headerBody}>
        {t('followingItemsBilledTo')}{' '}
        <Text style={styles.bold}>{store.currentJob?.jobNumber}</Text>
      </Text>
    </View>
  );

  return (
    <BaseResultScreen
      navigation={navigation}
      store={store}
      contextBody={t('youBilledFollowingItemsTo')}
      errorListTitle=""
      errorToastMessage=""
      title={store.currentJob?.jobNumber}
      isShowInvoiceTooltip
      Header={<Header />}
    />
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
