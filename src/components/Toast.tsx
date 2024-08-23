import { NamedExoticComponent, useCallback, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

import { colors, fonts, SVGs, toastColors } from '../theme';
import { ToastMessage } from './ToastMessage';
import { ToastType } from '../contexts/types';
import { testIds } from '../helpers';

const { width } = Dimensions.get('window');

export enum ToastActionType {
  Close = 'Close',
  Retry = 'Retry',
  Undo = 'Undo',
  Edit = 'Edit',
  OpenSettings = 'OpenSettings',
  Details = 'Details',
  Return = 'Return',
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
  [ToastType.DetailedScanError]: SVGs.BarcodeErrorIcon,
  [ToastType.ProductQuantityError]: SVGs.ProductErrorIcon,
  [ToastType.SpecialOrderError]: SVGs.ProductErrorIcon,
  [ToastType.ProductUpdateError]: SVGs.ProductErrorIcon,
  [ToastType.UpcUpdateError]: SVGs.ProductErrorIcon,
  [ToastType.SuggestedItemsError]: SVGs.SuggestedListErrorIcon,
  [ToastType.CreateInvoiceError]: SVGs.RefundErrorIcon,
  [ToastType.InvoiceMissingProductPrice]: SVGs.RefundErrorIcon,
  [ToastType.UnitsPerContainerError]: SVGs.ProductsErrorIcon,
  [ToastType.MinimumValueError]: SVGs.ProductsErrorIcon,
  [ToastType.MaximumValueError]: SVGs.ProductsErrorIcon,
  [ToastType.ProfileError]: SVGs.ProfileError,

  [ToastType.Info]: SVGs.ListAffirmativeIcon,
  [ToastType.TooltipInfo]: SVGs.InfoLargeIcon,
  [ToastType.TooltipCreateInvoice]: SVGs.CreateInvoiceTooltipIcon,
  [ToastType.UnitsPerContainerReset]: SVGs.ProductsErrorIcon,

  [ToastType.Success]: SVGs.ListAffirmativeIcon,
  [ToastType.ProductUpdateSuccess]: SVGs.AffirmationSolidIcon,
  [ToastType.SuggestedItemsSuccess]: SVGs.SuggestedListAffirmativeIcon,
  [ToastType.SuccessCreateJob]: SVGs.SuccessCreateJob,
  [ToastType.Retry]: SVGs.ListErrorIcon,

  [ToastType.BluetoothEnabled]: SVGs.BluetoothIconSuccess,
  [ToastType.BluetoothDisabled]: SVGs.BluetoothIconDisconnected,
  [ToastType.LocationDisabled]: SVGs.LocationPermIcon,
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
  const { t } = useTranslation();
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
      case ToastType.CreateInvoiceError:
      case ToastType.UnitsPerContainerError:
      case ToastType.DetailedScanError:
      case ToastType.InvoiceMissingProductPrice:
      case ToastType.SuccessCreateJob:
      case ToastType.ProfileError:
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
            {t('undo')}
          </Text>
        );
      case ToastActionType.Edit:
        return (
          <Text
            testID={testIds.idUndoText(testID)}
            style={[styles.action, { color: action }]}
          >
            {t('edit')}
          </Text>
        );
      case ToastActionType.OpenSettings:
        return (
          <Text
            testID={testIds.idSettingsText(testID)}
            style={[styles.action, { color: action }]}
          >
            {t('settings')}
          </Text>
        );
      case ToastActionType.Details:
        return (
          <Text
            testID={testIds.idDetailsButton(testID)}
            style={[styles.action, { color: action }]}
          >
            {t('details')}
          </Text>
        );
      case ToastActionType.Return:
        return (
          <Text
            testID={testIds.idDetailsButton(testID)}
            style={[styles.action, { color: action }]}
          >
            {t('return')}
          </Text>
        );
      default:
        return null;
    }
  }, [isLoading, action, actionType, testID, t]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, { backgroundColor: secondary }, style],
    [secondary, style],
  );

  const handleRightButtonPress = useCallback(async () => {
    switch (actionType) {
      case ToastActionType.Close:
      case ToastActionType.Edit:
      case ToastActionType.Return:
        onPress?.(id);
        onHide();
        break;
      case ToastActionType.Undo:
      case ToastActionType.OpenSettings:
        onPress?.(id);
        break;
      case ToastActionType.Details:
        onPress?.(ToastActionType.Details);
        onHide();
        break;
      case ToastActionType.Retry:
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
