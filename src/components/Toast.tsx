import React, { NamedExoticComponent, useCallback, useMemo } from 'react';
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

import { colors, fonts, SVGs, toastColors } from '../theme';
import { ToastMessage } from './ToastMessage';
import { ToastType } from '../contexts/types';
import { testIds } from '../helpers';

const { width } = Dimensions.get('window');

export enum ToastActionType {
  Close = 'Close',
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
  [ToastType.Info]: SVGs.ListAffirmativeIcon,
  [ToastType.Success]: SVGs.ListAffirmativeIcon,
  [ToastType.ScanError]: SVGs.BarcodeErrorIcon,
  [ToastType.ProductQuantityError]: SVGs.ProductErrorIcon,
  [ToastType.TooltipInfo]: SVGs.TooltipInfoIcon,
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
        return (
          <SVGs.CloseSmallIcon
            testID={testIds.idCloseIcon(testID)}
            color={action}
          />
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
  }, [actionType, testID, action]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, { backgroundColor: secondary }, style],
    [secondary, style],
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
    <View testID={testIds.idContainer(testID)} style={containerStyle}>
      {LeftIcon}
      {Message}
      <TouchableOpacity
        testID={testIds.idButton(testID)}
        hitSlop={27}
        onPress={handleRightButtonPress}
        style={styles.actionButton}
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
  actionButton: {
    height: '100%',
    justifyContent: 'center',
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
});
