import { InventoryUseType } from 'src/constants/common.enum';

export const getProductStepQty = (
  inventoryUseType?: InventoryUseType,
  options?: { disableDecimals?: boolean },
): number => {
  switch (inventoryUseType) {
    case InventoryUseType.Percent:
      return options?.disableDecimals ? 1 : 0.25;
    default:
      return 1;
  }
};
