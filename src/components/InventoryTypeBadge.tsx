import React, { memo, useMemo } from 'react';
import { ColoredTooltip } from './ColoredTooltip';
import { InventoryUseType } from '../constants/common.enum';
import { colors } from '../theme';
import { StyleProp, TextStyle } from 'react-native';

interface Props {
  inventoryUseTypeId?: number;
}

const InventoryTypeLabel = {
  [InventoryUseType.Stock]: 'Stock',
  [InventoryUseType.Percent]: 'Percent',
  [InventoryUseType.Container]: 'Container',
  [InventoryUseType.Each]: 'Each Piece',
  [InventoryUseType.NonStock]: 'Special Order',
  [InventoryUseType.All]: 'All',
};

export const InventoryTypeBadge = memo(({ inventoryUseTypeId }: Props) => {
  const label = inventoryUseTypeId
    ? InventoryTypeLabel[inventoryUseTypeId]
    : undefined;

  const labelTheme = useMemo<StyleProp<TextStyle>>(() => {
    switch (inventoryUseTypeId) {
      case InventoryUseType.Container:
        return { backgroundColor: colors.blueLight, color: colors.blue };
      case InventoryUseType.Each:
        return { backgroundColor: colors.greenLight, color: colors.green };
      case InventoryUseType.Percent:
        return { backgroundColor: colors.redLight, color: colors.redSemiLight };
      case InventoryUseType.NonStock:
        return { backgroundColor: colors.pinkLight, color: colors.pink };
      default:
        return undefined;
    }
  }, [inventoryUseTypeId]);

  return label ? (
    <ColoredTooltip title={label} textStyles={labelTheme} />
  ) : null;
});
