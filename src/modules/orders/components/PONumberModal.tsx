import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { SharedValue } from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import {
  ButtonCluster,
  Input,
  InputType,
  Modal,
  ModalProps,
  ToastMessage,
} from 'src/components';
import { colors, fonts, SVGs } from 'src/theme';
import AlertWrapper from 'src/contexts/AlertWrapper';

interface Props extends Omit<ModalProps, 'onClose'> {
  onSkip?: () => void;
  onSubmit?: (poNumber: string) => Promise<void>;
}

export const PONumberModal = observer(
  ({ isVisible, title, onSkip, onSubmit }: Props) => {
    const { t } = useTranslation();
    const [poNumber, setPONumber] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const headerHeight = useHeaderHeight();

    const topOffset = useMemo<SharedValue<number>>(
      () => ({ value: headerHeight }),
      [headerHeight],
    );

    const alertTitle = useMemo(
      () => <Text style={styles.alertTitle}>{t('addPONumberLater')}</Text>,
      [t],
    );

    const alertMessage = useMemo(
      () => (
        <View style={{ gap: 24, alignSelf: 'center' }}>
          <Text style={styles.text}>
            {t('yourOrderWillSaveInRepairstack1')}
            <Text style={styles.textBold}>
              {' '}
              {t('yourOrderWillSaveInRepairstack2')}
            </Text>{' '}
            {t('yourOrderWillSaveInRepairstack3')}
          </Text>
          <Text style={styles.text}>
            {t('managerCanAddPONumber')}{' '}
            <Text style={styles.textItalic}>repairstack.3m.com</Text>
          </Text>
          <Text style={styles.text}>{t('areYouSureYouWantToContinue')}</Text>
        </View>
      ),
      [t],
    );

    const handlePONumberChange = useCallback(
      (text: string) => setPONumber(text),
      [],
    );

    const closeAlert = useCallback(() => setIsAlertVisible(false), []);

    const handleSkipPress = useCallback(() => setIsAlertVisible(true), []);

    const handleSubmitPress = useCallback(async () => {
      setIsLoading(true);
      await onSubmit?.(poNumber);
      setIsLoading(false);
    }, [onSubmit, poNumber]);

    return (
      <Modal
        isVisible={isVisible}
        title={title}
        titleStyle={styles.modalTitle}
        titleContainerStyle={styles.titleContainer}
        semiTitle={t('purchaseOrder')}
        topOffset={topOffset}
        onClose={handleSkipPress}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.warningBar}>
              <SVGs.PONumberCautionIcon
                color={colors.blackSemiLight}
                primaryColor={colors.orange}
                secondaryColor={colors.background}
              />
              <ToastMessage>
                <ToastMessage style={styles.warningBarText} bold>
                  {t('poNumber')}
                </ToastMessage>{' '}
                {t('isRequiredForDistributor')}
              </ToastMessage>
            </View>

            <View style={styles.inputInfoContainer}>
              <Text style={styles.text}>
                {t('addOneHere')} <Text style={styles.textBold}>{t('or')}</Text>{' '}
                {t('yourManagerCan')}
                <Text style={styles.textBold}>{t('addPONumber')}</Text>{' '}
                {t('at')}{' '}
                <Text style={styles.textItalic}>repairstack.3m.com</Text>
                {t('forThisOrderToSubmit')}
              </Text>

              <Input
                contextMenuHidden
                type={InputType.Primary}
                placeholder={t('poNumber')}
                value={poNumber}
                keyboardType="number-pad"
                onChangeText={handlePONumberChange}
              />

              <Text style={styles.text}>{t('IfYouDontHaveInformation')}</Text>
            </View>
          </View>

          <ButtonCluster
            leftOnPress={handleSkipPress}
            leftTitle={t('skip')}
            rightTitle={t('continue')}
            rightOnPress={handleSubmitPress}
            rightDisabled={!poNumber}
            rightIsLoading={isLoading}
          />
        </View>

        <AlertWrapper
          visible={isAlertVisible}
          message={alertMessage}
          title={alertTitle}
          primaryTitle={t('yes')}
          secondaryTitle={t('no')}
          onPressPrimary={onSkip}
          onPressSecondary={closeAlert}
          alertContainerStyle={styles.alertContainer}
        />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  alertContainer: {
    paddingTop: 32,
    gap: 24,
  },
  alertTitle: {
    alignSelf: 'center',
    color: colors.black,
    fontFamily: fonts.TT_Bold,
    fontSize: 15,
  },
  button: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    padding: 16,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    gap: 24,
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  inputInfoContainer: {
    gap: 24,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
  },
  text: {
    textAlign: 'left',
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
  },
  textBold: {
    fontFamily: fonts.TT_Bold,
  },
  textItalic: {
    fontFamily: fonts.TT_LightItalic,
    fontWeight: 'normal',
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 2,
  },
  warningBar: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 5,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 8,
    marginTop: 24,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  warningBarText: {
    textAlign: 'left',
  },
});
