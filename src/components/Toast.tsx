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
import { ToastType } from '../contexts';
import { ToastMessage } from './ToastMessage';

const { width } = Dimensions.get('window');

export enum ToastActionType {
  Close = 'Close',
  Undo = 'Undo',
}

interface Props extends ToastProps {
  type: ToastType;
  actionType?: ToastActionType;
}

const Toast: React.FC<Props> = ({
  id,
  type = ToastType.Info,
  message,
  actionType,
  onHide,
  onPress,
}) => {
  const { primary, secondary, action } = toastColors[type] ?? {};

  const Icon = useMemo<JSX.Element | null>(() => {
    switch (type) {
      case ToastType.Error:
        return (
          <SVGs.ListErrorIcon
            color={colors.blackSemiLight}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        );
      case ToastType.Info:
        return (
          <SVGs.ListAffirmativeIcon
            color={colors.blackSemiLight}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        );
      case ToastType.Success:
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
  }, [primary, secondary, type]);

  const Message = useMemo<JSX.Element>(
    () =>
      typeof message === 'string' ? (
        <ToastMessage>{message}</ToastMessage>
      ) : (
        message
      ),
    [message],
  );

  const ActionButtonContent = useMemo<JSX.Element | null>(() => {
    switch (actionType) {
      case ToastActionType.Close:
        return <SVGs.CloseSmallIcon color={action} />;
      case ToastActionType.Undo:
        return <Text style={[styles.action, { color: action }]}>Undo</Text>;
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
      case ToastActionType.Undo:
        return onPress?.(id);
    }
  }, [actionType, onHide, onPress, id]);

  return (
    <View style={containerStyle}>
      {Icon}
      {Message}
      <TouchableOpacity hitSlop={27} onPress={handleRightButtonPress}>
        {ActionButtonContent}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    fontFamily: fonts.TT_Bold,
    fontSize: 13,
    letterSpacing: 0.16,
    lineHeight: 16,
  },
  container: {
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 16,
    height: 46,
    marginVertical: 4,
    paddingHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: width - 16,
  },
});

export default Toast;