import { StyleSheet, Text, View } from 'react-native';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';

import { SVGs, colors, fonts } from 'src/theme';

type SupportAlertWrapperProps = Omit<
  AlertWrapperProps,
  'title' | 'message' | 'hideSecondary' | 'primaryTitle'
>;

const SupportAlertWrapper: FC<SupportAlertWrapperProps> = props => {
  const { t } = useTranslation();
  const title = (
    <View style={styles.titleContainer}>
      <SVGs.SupportIcon color={colors.grayDark3} style={{ marginRight: 6 }} />
      <Text style={styles.titleLabel}>{t('support')}</Text>
    </View>
  );

  const message = (
    <View style={[styles.container, styles.messageContainer]}>
      <View>
        <Text style={[styles.headline, styles.label, { marginLeft: 26 }]}>
          {t('repairStackTechnical')}
        </Text>

        <View style={styles.rowContainer}>
          <SVGs.TelephoneIcon color={colors.black} style={styles.icon} />
          <View>
            <Text style={[styles.label, styles.boldLabel, { lineHeight: 20 }]}>
              1-833-686-0248
            </Text>
            <Text style={styles.label}>{t('supportIsAvailable')} </Text>
            <Text style={styles.label}>7:00am – 7:00pm CST</Text>
          </View>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <SVGs.EmailIcon color={colors.black} style={styles.icon} />
        <View>
          <Text style={[styles.label, styles.boldLabel]}>
            support-repairstack@mmm.com
          </Text>
          <Text style={styles.label}>{t('emailsAreAnswered24Hours')}</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <SVGs.TelephoneIcon
          color={colors.black}
          style={[styles.icon, { alignSelf: 'flex-end' }]}
        />
        <View>
          <Text style={[styles.headline, styles.label]}>
            {t('generalProduct')}
          </Text>
          <Text style={[styles.label, styles.boldLabel]}>1-844-204-7071</Text>
        </View>
      </View>
    </View>
  );

  return (
    <AlertWrapper
      title={title}
      message={message}
      hideSecondary
      primaryTitle={t('Close')}
      {...props}
    />
  );
};

export default memo(SupportAlertWrapper);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLabel: {
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    fontWeight: '700',
  },
  messageContainer: {
    marginTop: 24,
  },
  rowContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: colors.grayDark4,
  },
  boldLabel: {
    fontWeight: '700',
  },
  headline: {
    fontSize: 14,
    fontFamily: fonts.TT_Regular,
    fontWeight: '700',
  },
});
