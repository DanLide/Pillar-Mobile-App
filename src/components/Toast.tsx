import React, { useCallback, useMemo } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';

import { colors, fonts, toastColors, SVGs } from '../theme';

const { width } = Dimensions.get('window');

export enum ToastIconType {
  Error = 'Error',
  Info = 'Info',
  Success = 'Success',
}

export enum ToastActionType {
  Close = 'Close',
}

interface Props extends ToastProps {
  iconType?: ToastIconType;
  actionType?: ToastActionType;
}

const Toast: React.FC<Props> = ({
  type = 'normal',
  message,
  iconType,
  actionType,
  onHide,
}) => {
  const { primary, secondary, action } = toastColors[type] ?? {};

  const Icon = useMemo<JSX.Element | null>(() => {
    switch (iconType) {
      case ToastIconType.Error:
        return (
          <SVGs.ListErrorIcon
            color={colors.blackSemiLight}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        );
      case ToastIconType.Info:
        return (
          <SVGs.ListAffirmativeIcon
            color={colors.blackSemiLight}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        );
      case ToastIconType.Success:
        return (
          <SVGs.ListErrorIcon
            color={colors.blackSemiLight}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        );
      default:
        return null;
    }
  }, [iconType, primary, secondary]);

  const Message = useMemo<JSX.Element>(
    () =>
      typeof message === 'string' ? (
        <Text numberOfLines={2} style={styles.message}>
          {message}
        </Text>
      ) : (
        message
      ),
    [message],
  );

  const ActionButtonContent = useMemo<JSX.Element | null>(() => {
    switch (actionType) {
      case ToastActionType.Close:
        return <SVGs.CloseSmallIcon color={action} />;
      default:
        return null;
    }
  }, [actionType, action]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, { backgroundColor: secondary }],
    [secondary],
  );

  const handleRightButtonPress = useCallback(() => {
    switch (actionType) {
      case ToastActionType.Close:
        return onHide();
    }
  }, [onHide, actionType]);

  return (
    <View style={containerStyle}>
      {Icon}
      {Message}
      <TouchableOpacity hitSlop={16} onPress={handleRightButtonPress}>
        {ActionButtonContent}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 18.5,
    height: 54,
    marginVertical: 4,
    paddingHorizontal: 18.5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: width - 18.5,
  },
  message: {
    color: colors.blackSemiLight,
    flex: 1,
    fontFamily: fonts.TT_Regular,
    fontSize: 16.5,
    lineHeight: 20.5,
  },
});

export default Toast;
