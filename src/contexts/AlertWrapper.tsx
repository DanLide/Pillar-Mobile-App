import { memo, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import i18n from 'i18next';

import { Button, ButtonType } from '../components';
import { colors, fonts } from '../theme';
import { testIds } from '../helpers';

export type AlertWrapperProps = {
  visible: boolean;
  message: string | JSX.Element;
  onPressPrimary?: () => void;
  onPressSecondary?: () => void;
  title?: string | JSX.Element;
  primaryTitle?: string;
  secondaryTitle?: string;
  secondaryType?: ButtonType;
  hidePrimary?: boolean;
  hideSecondary?: boolean;
  alertContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

const AlertWrapper: React.FC<AlertWrapperProps> = ({
  visible,
  message,
  title,
  onPressPrimary,
  primaryTitle = i18n.t('continue'),
  secondaryTitle = i18n.t('cancel'),
  secondaryType = ButtonType.secondary,
  onPressSecondary,
  hideSecondary,
  hidePrimary,
  alertContainerStyle,
  testID = 'alertWrapper',
}) => {
  const mergedAlertContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.alertContainer, alertContainerStyle],
    [alertContainerStyle],
  );

  return (
    <Modal testID={testIds.idModal(testID)} transparent visible={visible}>
      <View style={styles.container}>
        <View style={mergedAlertContainerStyle}>
          {typeof title === 'string' ? (
            <Text style={styles.titleText}>{title}</Text>
          ) : (
            title
          )}
          {typeof message === 'string' ? (
            <Text style={styles.messageText}>{message}</Text>
          ) : (
            message
          )}
          <View style={styles.buttonsContainer}>
            {!hideSecondary && (
              <Button
                testID={testIds.idSecondaryButton(testID)}
                type={secondaryType}
                title={secondaryTitle}
                buttonStyle={styles.buttonStyle}
                onPress={onPressSecondary}
              />
            )}
            {!hidePrimary && (
              <Button
                testID={testIds.idPrimaryButton(testID)}
                type={ButtonType.primary}
                title={primaryTitle}
                buttonStyle={styles.buttonStyle}
                onPress={onPressPrimary}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
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
    gap: 16,
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonStyle: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default memo(AlertWrapper);
