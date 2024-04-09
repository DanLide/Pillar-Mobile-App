import { useMemo } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import { ColoredTooltip } from '../../../components';

import { OrderStatusType } from '../../../constants/common.enum';

import { SVGs, colors } from '../../../theme';

interface Props {
  orderStatusType: OrderStatusType | string;
  isString?: boolean;
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

export const StatusBadge: React.FC<Props> = ({ orderStatusType, isString }) => {
  const label = isString
    ? orderStatusType
    : OrderTitleByStatusType[orderStatusType]
    ? OrderTitleByStatusType[orderStatusType]
    : undefined;

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
      default:
        return undefined;
    }
  }, [orderStatusType]);

  return (
    <View style={styles.container}>
      {label ? (
        <ColoredTooltip
          title={label === 'Receiving' ? 'Backordered' : label}
          textStyles={badgeStyle}
          icon={renderIcon}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
});
