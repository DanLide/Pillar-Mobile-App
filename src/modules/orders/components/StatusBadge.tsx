import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import { ColoredTooltip } from '../../../components';

import { OrderStatusType } from '../../../constants/common.enum';

import { colors } from '../../../theme';

interface Props {
  orderStatusType: OrderStatusType;
}

export const OrderTitleByStatusType = {
  [OrderStatusType.APPROVAL]: 'Approval',
  [OrderStatusType.POREQUIRED]: 'PO Required',
  [OrderStatusType.SHIPPED]: 'Shipped',
  [OrderStatusType.RECEIVING]: 'Receiving',
  [OrderStatusType.SUBMITTED]: 'Submitted',
  [OrderStatusType.TRANSMITTED]: 'Transmitted',
  [OrderStatusType.CLOSED]: 'Closed',
  [OrderStatusType.CANCELLED]: 'Cancelled',
};

export const StatusBadge: React.FC<Props> = ({ orderStatusType }) => {
  const label = OrderTitleByStatusType[orderStatusType]
    ? OrderTitleByStatusType[orderStatusType]
    : undefined;

  const badgeStyle = useMemo<StyleProp<ViewStyle>>(() => {
    switch (orderStatusType) {
      case OrderStatusType.APPROVAL:
      case OrderStatusType.POREQUIRED:
      case OrderStatusType.SHIPPED:
      case OrderStatusType.RECEIVING:
      case OrderStatusType.SUBMITTED:
      case OrderStatusType.TRANSMITTED:
        return { backgroundColor: colors.magnolia, color: colors.purple };
      case OrderStatusType.CLOSED:
      case OrderStatusType.CANCELLED:
        return { backgroundColor: colors.background, color: colors.grayDark2 };
      default:
        return undefined;
    }
  }, [orderStatusType]);

  return (
    <View style={styles.container}>
      {label ? <ColoredTooltip title={label} textStyles={badgeStyle} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
