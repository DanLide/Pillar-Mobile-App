import { Permissions, permissions } from '../helpers';
import { Permission } from '../../constants';

type PermissionMap = {
  [K in keyof typeof KNOWN_PERMISSIONS]: boolean;
};
type PermissionKey = keyof typeof KNOWN_PERMISSIONS

const KNOWN_PERMISSIONS = {
  viewOrders: Permission.InventoryManagement_OrderMobile_View,
  createOrder: Permission.InventoryManagement_OrderMobile_Create,
  receiveOrder: Permission.InventoryManagement_StockMobile_Receive,
  configureShop: Permission.Administration_Devices_Create,
  removeProduct: Permission.InventoryManagement_StockMobile_Remove,
  returnProduct: Permission.InventoryManagement_StockMobile_Return,
  editProduct: Permission.InventoryManagement_StockMobile_Edit,
  editProductInStock: Permission.InventoryManagement_ProductsInStockMobile_Edit,
}
const ENUM_BASE = 64; // .NET ULong base

export class PermissionProvider {
  private permissions: Permissions;

  constructor(_permissions = permissions()) {
    this.permissions = _permissions;
  }

  get userPermissions() {
    return Object.entries(KNOWN_PERMISSIONS).reduce((acc, [key, value]) => {
      acc[key as PermissionKey] = this.hasPermission(value)

      return acc
    }, {} as PermissionMap)
  }

  private hasPermission(permission: Permission): boolean {
    const permissionSet = this.permissions.getPermissionSet;

    if (!permissionSet?.length) return false;

    const permissionMask = permissionSet[(permission / ENUM_BASE) >> 0];
    const permissionValue = BigInt(1) << BigInt(permission % ENUM_BASE);

    return BigInt(permissionMask & permissionValue) == permissionValue;
  }
}
