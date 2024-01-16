import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { SharedValue } from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

import {
  Button,
  ButtonType,
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

const semiTitle = 'Purchase Order (PO)';

export const PONumberModal = observer(
  ({ isVisible, title, onSkip, onSubmit }: Props) => {
    const [poNumber, setPONumber] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const headerHeight = useHeaderHeight();

    const topOffset = useMemo<SharedValue<number>>(
      () => ({ value: headerHeight }),
      [headerHeight],
    );

    const alertTitle = useMemo(
      () => <Text style={styles.alertTitle}>Add PO Number Later?</Text>,
      [],
    );

    const alertMessage = useMemo(
      () => (
        <View style={{ gap: 24, alignSelf: 'center' }}>
          <Text style={styles.text}>
            Your order will save in Repairstack,{'\n'}
            but <Text style={styles.textBold}>will not be sent</Text> to your
            {'\n'}
            distributor.
          </Text>
          <Text style={styles.text}>
            A manager can add a PO Number at{' '}
            <Text style={styles.textItalic}>repairstack.3m.com</Text>
          </Text>
          <Text style={styles.text}>Are you sure you want to continue?</Text>
        </View>
      ),
      [],
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
        semiTitle={semiTitle}
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
                  PO number
                </ToastMessage>{' '}
                is required for this distributor
              </ToastMessage>
            </View>

            <View style={styles.inputInfoContainer}>
              <Text style={styles.text}>
                Add one here <Text style={styles.textBold}>or</Text> your
                manager can{'\n'}
                <Text style={styles.textBold}>add a PO number</Text> at{' '}
                <Text style={styles.textItalic}>repairstack.3m.com</Text>
                {'\n'}for this order to submit to your distributor
              </Text>

              <Input
                contextMenuHidden
                type={InputType.Primary}
                placeholder="PO Number"
                value={poNumber}
                keyboardType="number-pad"
                onChangeText={handlePONumberChange}
              />

              <Text style={styles.text}>
                If you don’t have this information on hand,{'\n'}reach out to
                your manager.
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <Button
              type={ButtonType.secondary}
              title="Skip"
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={handleSkipPress}
            />
            <Button
              type={ButtonType.primary}
              title="Continue"
              disabled={!poNumber}
              isLoading={isLoading}
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={handleSubmitPress}
            />
          </View>
        </View>

        <AlertWrapper
          visible={isAlertVisible}
          message={alertMessage}
          title={alertTitle}
          primaryTitle="Yes"
          secondaryTitle="No"
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
