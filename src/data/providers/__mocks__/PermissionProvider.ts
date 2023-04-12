import { Permission } from '../../../constants';

export const mockedPermissionSets = {
  empty: [],
  technician: [11825453766148080n, 35187664896000n],
  distributor: [4055666524160n, 105553187569672n],
};

export const testPermissions = {
  returnProduct: Permission.InventoryManagement_StockMobile_Return,
  removeProduct: Permission.InventoryManagement_StockMobile_Remove,
  receiveOrder: Permission.InventoryManagement_StockMobile_Receive,
};
