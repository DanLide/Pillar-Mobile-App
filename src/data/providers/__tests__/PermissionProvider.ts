import { PermissionProvider } from '../PermissionProvider';
import {
  getPermissionsMock,
  mockedPermissionSets,
  testPermissions,
} from '../__mocks__/PermissionProvider';

const { technician, distributor, mso, admin, empty } = mockedPermissionSets;
const { returnProduct, removeProduct, receiveOrder, editProduct } =
  testPermissions;

describe('PermissionProvider', () => {
  const technicianPermissionsMock = getPermissionsMock(technician);
  const distributorPermissionsMock = getPermissionsMock(distributor);
  const msoPermissionsMock = getPermissionsMock(mso);
  const adminPermissionsMock = getPermissionsMock(admin);
  const emptyPermissionsMock = getPermissionsMock(empty);

  it('should NOT grant permission if permission set is undefined', () => {
    const permissionProvider = new PermissionProvider();

    expect(permissionProvider.hasPermission(removeProduct)).toBeFalsy();
  });

  it('should NOT grant permission if permission set is empty', () => {
    const permissionProvider = new PermissionProvider(emptyPermissionsMock);

    expect(permissionProvider.hasPermission(removeProduct)).toBeFalsy();
  });

  it('should grant Remove Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(removeProduct)).toBeTruthy();
  });

  it('should NOT grant Remove Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(removeProduct)).toBeFalsy();
  });

  it('should grant Remove Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.hasPermission(removeProduct)).toBeTruthy();
  });

  it('should grant Remove Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.hasPermission(removeProduct)).toBeTruthy();
  });

  it('should grant Return Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(returnProduct)).toBeTruthy();
  });

  it('should NOT grant Return Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(returnProduct)).toBeFalsy();
  });

  it('should grant Return Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.hasPermission(returnProduct)).toBeTruthy();
  });

  it('should grant Return Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.hasPermission(returnProduct)).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(receiveOrder)).toBeFalsy();
  });

  it('should grant Receive Order permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(receiveOrder)).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.hasPermission(receiveOrder)).toBeFalsy();
  });

  it('should grant Receive Order permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.hasPermission(receiveOrder)).toBeTruthy();
  });

  it('should NOT grant Edit Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.hasPermission(editProduct)).toBeFalsy();
  });

  it('should NOT grant Edit Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.hasPermission(editProduct)).toBeFalsy();
  });

  it('should grant Edit Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.hasPermission(editProduct)).toBeTruthy();
  });

  it('should grant Edit Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.hasPermission(editProduct)).toBeTruthy();
  });
});
