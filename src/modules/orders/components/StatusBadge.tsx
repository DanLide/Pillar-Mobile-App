import { useMemo } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import i18n from 'i18next';
import { ColoredTooltip } from '../../../components';

import { OrderStatusType } from '../../../constants/common.enum';

import { SVGs, colors } from '../../../theme';

interface Props {
  orderStatusType: OrderStatusType | string;
  isString?: boolean;
  isReturnOrder?: boolean;
}

export const OrderTitleByStatusType: Record<string, string> = {
  [OrderStatusType.APPROVAL]: 'Approval',
  [OrderStatusType.POREQUIRED]: 'PO Required',
  [OrderStatusType.SHIPPED]: 'Shipped',
  [OrderStatusType.RECEIVING]: 'Receiving',
  [OrderStatusType.SUBMITTED]: 'Submitted',
  [OrderStatusType.TRANSMITTED]: 'Transmitted',
  [OrderStatusType.CLOSED]: 'Closed',
  [OrderStatusType.CANCELLED]: 'Cancelled',
};

const getOrderTitleByStatusTypeI18n = (label: string) => {
  const OrderTitleByStatusTypeI18n: Record<string, string> = {
    ['Approval']: i18n.t('approval'),
    ['PO Required']: i18n.t('poRequired'),
    ['Shipped']: i18n.t('shipped'),
    ['Receiving']: i18n.t('receiving'),
    ['Submitted']: i18n.t('submitted'),
    ['Transmitted']: i18n.t('transmitted'),
    ['Closed']: i18n.t('closed'),
    ['Cancelled']: i18n.t('cancelled'),
  };

  return OrderTitleByStatusTypeI18n[label];
};

export const getBadgeStyleByStatusType = (orderStatusType: string) => {
  switch (orderStatusType) {
    case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
    case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
    case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
    case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
    case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
    case OrderTitleByStatusType[OrderStatusType.TRANSMITTED]:
      return {
        backgroundColor: colors.magnolia,
        color: colors.purple,
      };
    case OrderTitleByStatusType[OrderStatusType.CLOSED]:
    case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
      return {
        backgroundColor: colors.background,
        color: colors.grayDark2,
      };
    default:
      return undefined;
  }
};

export const StatusBadge: React.FC<Props> = ({
  orderStatusType,
  isString,
  isReturnOrder,
}) => {
  const { t } = useTranslation();
  const label = isString
    ? orderStatusType
    : OrderTitleByStatusType[orderStatusType];

  const badgeStyle = useMemo<StyleProp<ViewStyle>>(() => {
    if (isString) {
      return getBadgeStyleByStatusType(orderStatusType);
    }
    switch (orderStatusType) {
      case OrderStatusType.APPROVAL:
      case OrderStatusType.POREQUIRED:
      case OrderStatusType.SHIPPED:
      case OrderStatusType.RECEIVING:
      case OrderStatusType.SUBMITTED:
      case OrderStatusType.TRANSMITTED:
        return {
          backgroundColor: colors.magnolia,
          color: colors.purple,
        };
      case OrderStatusType.CLOSED:
      case OrderStatusType.CANCELLED:
        return { backgroundColor: colors.background, color: colors.grayDark2 };
      default:
        return undefined;
    }
  }, [isString, orderStatusType]);

  const renderIcon = useMemo(() => {
    switch (orderStatusType) {
      case OrderStatusType.POREQUIRED:
      case OrderStatusType.APPROVAL:
        return <SVGs.TransparentWarning />;
      case OrderStatusType.CLOSED:
        if (isReturnOrder) {
          return <SVGs.ReturnOrderIcon />;
        }
        return undefined;
      default:
        return undefined;
    }
  }, [orderStatusType, isReturnOrder]);

  return (
    <View style={styles.container}>
      {label && (
        <ColoredTooltip
          title={
            label === 'Receiving'
              ? t('backordered')
              : getOrderTitleByStatusTypeI18n(label)
          }
          textStyles={badgeStyle}
          icon={renderIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
});
