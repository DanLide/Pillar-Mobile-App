import { InventoryUseType } from '../../constants/common.enum';

export const getProductMinQty = (
  inventoryUseType?: InventoryUseType,
): number => {
  switch (inventoryUseType) {
    case InventoryUseType.Percent:
      return 0.25;
    default:
      return 1;
  }
};
