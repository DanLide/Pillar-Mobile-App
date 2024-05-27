import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';
import { fonts } from 'src/theme';

type Props = Omit<AlertWrapperProps, 'message'>;

const EraseProductsAlert: FC<Props> = props => {
  const { t } = useTranslation();
  return (
    <AlertWrapper
      title={
        <Text style={[styles.title, styles.label, styles.textBold]}>
          {t('goBack')}
        </Text>
      }
      message={
        <View>
          <Text
            style={[styles.label, { marginBottom: 12, paddingHorizontal: 36 }]}
          >
            {t('ifYouGoBack1')}
            <Text style={styles.textBold}>{t('ifYouGoBack2')}</Text>
            {t('ifYouGoBack3')}{' '}
            <Text style={styles.textBold}>{t('ifYouGoBack4')}</Text>
          </Text>

          <Text style={styles.label}>{t('areYouSureYouWantToContinue')}</Text>
        </View>
      }
      primaryTitle={t('continue')}
      secondaryTitle={t('cancel')}
      {...props}
    />
  );
};

export default EraseProductsAlert;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
});
