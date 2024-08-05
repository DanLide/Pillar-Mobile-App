import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { commonStyles, fonts } from 'src/theme';
import { ButtonCluster } from '../ButtonCluster';
import { ButtonType } from '../Button';
import { ModalComponentProp } from 'react-native-modalfy';
import { IModalStackParamsList } from 'src/types';

interface IModalParams {
  onAction: IModalStackParamsList['EraseProductModal']['onAction'];
}

export const EraseProductModal = ({
  modal: { closeModal, getParam },
}: ModalComponentProp<IModalStackParamsList, IModalParams>) => {
  const { t } = useTranslation();
  const onAction = getParam('onAction', closeModal);
  const onLeftPress = () => {
    onAction();
    closeModal();
  };
  return (
    <View style={commonStyles.modalView}>
      <Text style={[styles.title, styles.label, styles.textBold]}>
        {`${t('goBack')}?`}
      </Text>
      <Text style={[styles.label, styles.rootLabel]}>
        {t('ifYouGoBack1')}
        <Text style={styles.textBold}> {t('ifYouGoBack2')} </Text>
        {t('ifYouGoBack3')}{' '}
        <Text style={styles.textBold}>{t('ifYouGoBack4')}</Text>
      </Text>

      <Text style={styles.label}>
        <Text style={styles.label}>{t('areYouSureYouWantTo')} </Text>
        <Text style={styles.textBold}>{t('goBack').toLowerCase()}?</Text>
      </Text>
      <ButtonCluster
        rightTitle={t('stay')}
        rightType={ButtonType.primary}
        rightOnPress={closeModal}
        leftTitle={t('goBack')}
        leftType={ButtonType.secondaryRed}
        leftOnPress={onLeftPress}
        withoutHorizontalPadding
        style={styles.buttons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginBottom: 16,
    lineHeight: 19,
  },
  buttons: { paddingHorizontal: 0, paddingBottom: 0, paddingTop: 32 },
  label: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
  },
  rootLabel: { marginBottom: 16, paddingHorizontal: 36 },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
});
