import React, {
  NamedExoticComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';

import { colors, fonts, SVGs, toastColors } from '../theme';
import { ToastMessage } from './ToastMessage';
import { ToastType } from '../contexts/types';
import { testIds } from '../helpers';

const { width } = Dimensions.get('window');

export enum ToastActionType {
  Close = 'Close',
  Retry = 'Retry',
  Undo = 'Undo',
}

interface Props
  extends Pick<ToastProps, 'id' | 'message' | 'style' | 'onHide' | 'onPress'> {
  testID?: string;
  type: ToastType;
  actionType?: ToastActionType;
}

const icons: Record<
  ToastType,
  NamedExoticComponent<SVGs.SvgPropsWithColors>
> = {
  [ToastType.Error]: SVGs.ListErrorIcon,
  [ToastType.ScanError]: SVGs.BarcodeErrorIcon,
  [ToastType.ProductQuantityError]: SVGs.ProductErrorIcon,
  [ToastType.ProductUpdateError]: SVGs.ProductErrorIcon,

  [ToastType.Info]: SVGs.ListAffirmativeIcon,
  [ToastType.TooltipInfo]: SVGs.InfoLargeIcon,

  [ToastType.Success]: SVGs.ListAffirmativeIcon,
  [ToastType.ProductUpdateSuccess]: SVGs.AffirmationSolidIcon,
};

export const Toast: React.FC<Props> = ({
  testID = 'toast',
  id,
  type = ToastType.Info,
  message,
  actionType,
  style,
  onHide,
  onPress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { primary, secondary, action } = toastColors[type] ?? {};

  const LeftIcon = useMemo<JSX.Element>(() => {
    const Icon = icons[type];

    return (
      <Icon
        color={colors.blackSemiLight}
        primaryColor={primary}
        secondaryColor={secondary}
      />
    );
  }, [primary, secondary, type]);

  const messageStyle = useMemo(() => {
    switch (type) {
      case ToastType.ProductUpdateSuccess:
        return styles.messageLeft;
      default:
        return null;
    }
  }, [type]);

  const Message = useMemo<JSX.Element>(() => {
    if (typeof message === 'string') {
      return <ToastMessage style={messageStyle}>{message}</ToastMessage>;
    }

    return message;
  }, [message, messageStyle]);

  const ActionButtonContent = useMemo<JSX.Element | null>(() => {
    if (isLoading) return <ActivityIndicator size="small" color={action} />;

    switch (actionType) {
      case ToastActionType.Close:
        return (
          <SVGs.CloseSmallIcon
            testID={testIds.idCloseIcon(testID)}
            color={action}
          />
        );
      case ToastActionType.Retry:
        return (
          <Text
            testID={testIds.idRetryText(testID)}
            style={[styles.action, { color: action }]}
          >
            Retry
          </Text>
        );
      case ToastActionType.Undo:
        return (
          <Text
            testID={testIds.idUndoText(testID)}
            style={[styles.action, { color: action }]}
          >
            Undo
          </Text>
        );
      default:
        return null;
    }
  }, [isLoading, action, actionType, testID]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, { backgroundColor: secondary }, style],
    [secondary, style],
  );

  const handleRightButtonPress = useCallback(async () => {
    switch (actionType) {
      case ToastActionType.Close:
        onHide();
        break;
      case ToastActionType.Retry:
      case ToastActionType.Undo:
        setIsLoading(true);
        await onPress?.(id);
        setIsLoading(false);
        break;
    }
  }, [actionType, onHide, onPress, id]);

  return (
    <View testID={testIds.idContainer(testID)} style={containerStyle}>
      {LeftIcon}
      {Message}
      <TouchableOpacity
        testID={testIds.idButton(testID)}
        hitSlop={27}
        onPress={handleRightButtonPress}
      >
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
    minHeight: 46,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: width - 16,
  },
  messageLeft: { textAlign: 'left' },
});
