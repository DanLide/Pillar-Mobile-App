import { InventoryUseType } from '../../constants/common.enum';

export const getProductStepQty = (
  inventoryUseType?: InventoryUseType,
): number => {
  switch (inventoryUseType) {
    case InventoryUseType.Percent:
      return 0.25;
    default:
      return 1;
  }
};
