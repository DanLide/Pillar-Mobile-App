import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

import { Button, ButtonType } from '../components';
import { colors, fonts } from '../theme';
import { testIds } from '../helpers';

type AlertWrapper = {
  children: React.ReactNode;
  visible: boolean;
  message: string;
  title: string;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
  primaryTitle?: string;
  secondaryTitle?: string;
  testID?: string;
};

const AlertWrapper: React.FC<AlertWrapper> = ({
  children,
  visible,
  message,
  title,
  onPressPrimary,
  primaryTitle = 'Continue',
  secondaryTitle = 'Cancel',
  onPressSecondary,
  testID = 'alertWrapper',
}) => {
  return (
    <>
      {children}
      <Modal testID={testIds.idModal(testID)} transparent visible={visible}>
        <View style={styles.container}>
          <View style={styles.alertContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
            <View style={styles.buttonsContainer}>
              <Button
                testID={testIds.idSecondaryButton(testID)}
                type={ButtonType.secondary}
                title={secondaryTitle}
                buttonStyle={styles.buttonStyle}
                onPress={onPressSecondary}
              />
              <Button
                testID={testIds.idPrimaryButton(testID)}
                type={ButtonType.primary}
                title={primaryTitle}
                buttonStyle={styles.buttonStyle}
                onPress={onPressPrimary}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackWidthOpacity,
  },
  alertContainer: {
    borderRadius: 8,
    backgroundColor: colors.white,
    width: '90%',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  messageText: {
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
  },
  titleText: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: fonts.TT_Regular,
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default AlertWrapper;
