import { PermissionProvider } from '../PermissionProvider';
import { Permission } from '../../../constants';
import { mockedPermissionSets } from '../__mocks__/PermissionProvider';

const { technician, distributor, empty } = mockedPermissionSets;

describe('PermissionProvider', () => {
  const technicianPermissions = { getPermissionSet: technician };
  const distributorPermissions = { getPermissionSet: distributor };
  const emptyPermissions = { getPermissionSet: empty };

  it('should grant Return Product permission for technician', () => {
    const permissionProvider = new PermissionProvider(technicianPermissions);
    const returnProductPermission =
      Permission.InventoryManagement_StockMobile_Return;

    expect(
      permissionProvider.hasPermission(returnProductPermission),
    ).toBeTruthy();
  });

  it('should NOT grant Return Product permission for distributor', () => {
    const permissionProvider = new PermissionProvider(distributorPermissions);
    const returnProductPermission =
      Permission.InventoryManagement_StockMobile_Return;

    expect(
      permissionProvider.hasPermission(returnProductPermission),
    ).toBeFalsy();
  });

  it('should grant Receive Order permission for distributor', () => {
    const permissionProvider = new PermissionProvider(distributorPermissions);
    const receiveOrderPermission =
      Permission.InventoryManagement_StockMobile_Receive;

    expect(
      permissionProvider.hasPermission(receiveOrderPermission),
    ).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for technician', () => {
    const permissionProvider = new PermissionProvider(technicianPermissions);
    const receiveOrderPermission =
      Permission.InventoryManagement_StockMobile_Receive;

    expect(
      permissionProvider.hasPermission(receiveOrderPermission),
    ).toBeFalsy();
  });

  it('should NOT grant Remove Product permission if permission set is undefined', () => {
    const permissionProvider = new PermissionProvider();
    const removeProductPermission =
      Permission.InventoryManagement_StockMobile_Remove;

    expect(
      permissionProvider.hasPermission(removeProductPermission),
    ).toBeFalsy();
  });

  it('should NOT grant Remove Product permission if permission set is empty', () => {
    const permissionProvider = new PermissionProvider(emptyPermissions);
    const removeProductPermission =
      Permission.InventoryManagement_StockMobile_Remove;

    expect(
      permissionProvider.hasPermission(removeProductPermission),
    ).toBeFalsy();
  });
});
