import { PermissionProvider } from '../PermissionProvider';
import {
  mockedPermissionSets,
  testPermissions,
} from '../__mocks__/PermissionProvider';

const { technician, distributor, empty } = mockedPermissionSets;
const { returnProduct, removeProduct, receiveOrder } = testPermissions;

describe('PermissionProvider', () => {
  const technicianPermissionsMock = { getPermissionSet: technician };
  const distributorPermissionsMock = { getPermissionSet: distributor };
  const emptyPermissionsMock = { getPermissionSet: empty };

  it('should grant Return Product permission for technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(returnProduct)).toBeTruthy();
  });

  it('should NOT grant Return Product permission for distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(returnProduct)).toBeFalsy();
  });

  it('should grant Receive Order permission for distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(receiveOrder)).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(receiveOrder)).toBeFalsy();
  });

  it('should NOT grant Remove Product permission if permission set is undefined', () => {
    const permissionProvider = new PermissionProvider();

    expect(permissionProvider.hasPermission(removeProduct)).toBeFalsy();
  });

  it('should NOT grant Remove Product permission if permission set is empty', () => {
    const permissionProvider = new PermissionProvider(emptyPermissionsMock);

    expect(permissionProvider.hasPermission(removeProduct)).toBeFalsy();
  });
});
