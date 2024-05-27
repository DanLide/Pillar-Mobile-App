import { memo, useMemo } from 'react';
import i18n from 'i18next';
import { ColoredTooltip } from './ColoredTooltip';
import { InventoryUseType } from '../constants/common.enum';
import { colors } from '../theme';
import { StyleProp, TextStyle } from 'react-native';

interface Props {
  inventoryUseTypeId?: number;
}

const getInventoryTypeLabel = (inventoryUseTypeId: number) => {
  const InventoryTypeLabel = {
    [InventoryUseType.Stock]: i18n.t('stock'),
    [InventoryUseType.Percent]: i18n.t('percent'),
    [InventoryUseType.Container]: i18n.t('container'),
    [InventoryUseType.Each]: i18n.t('eachPiece'),
    [InventoryUseType.NonStock]: i18n.t('specialOrder'),
    [InventoryUseType.All]: i18n.t('all'),
  };

  return InventoryTypeLabel[inventoryUseTypeId];
};

export const InventoryTypeBadge = memo(({ inventoryUseTypeId }: Props) => {
  const label = inventoryUseTypeId
    ? getInventoryTypeLabel(inventoryUseTypeId)
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
