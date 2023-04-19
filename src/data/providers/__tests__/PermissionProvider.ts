import { PermissionProvider } from '../PermissionProvider';
import {
  getPermissionsMock,
  mockedPermissionSets,
} from '../__mocks__/PermissionProvider';

const { technician, distributor, mso, admin, empty } = mockedPermissionSets;

describe('PermissionProvider', () => {
  const technicianPermissionsMock = getPermissionsMock(technician);
  const distributorPermissionsMock = getPermissionsMock(distributor);
  const msoPermissionsMock = getPermissionsMock(mso);
  const adminPermissionsMock = getPermissionsMock(admin);
  const emptyPermissionsMock = getPermissionsMock(empty);

  it('should NOT grant permission if permission set is undefined', () => {
    const permissionProvider = new PermissionProvider();

    expect(permissionProvider.canRemoveProduct()).toBeFalsy();
  });

  it('should NOT grant permission if permission set is empty', () => {
    const permissionProvider = new PermissionProvider(emptyPermissionsMock);

    expect(permissionProvider.canRemoveProduct()).toBeFalsy();
  });

  it('should grant Remove Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.canRemoveProduct()).toBeTruthy();
  });

  it('should NOT grant Remove Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.canRemoveProduct()).toBeFalsy();
  });

  it('should grant Remove Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.canRemoveProduct()).toBeTruthy();
  });

  it('should grant Remove Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.canRemoveProduct()).toBeTruthy();
  });

  it('should grant Return Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.canReturnProduct()).toBeTruthy();
  });

  it('should NOT grant Return Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.canReturnProduct()).toBeFalsy();
  });

  it('should grant Return Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.canReturnProduct()).toBeTruthy();
  });

  it('should grant Return Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.canReturnProduct()).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.canReceiveOrder()).toBeFalsy();
  });

  it('should grant Receive Order permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.canReceiveOrder()).toBeTruthy();
  });

  it('should NOT grant Receive Order permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.canReceiveOrder()).toBeFalsy();
  });

  it('should grant Receive Order permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.canReceiveOrder()).toBeTruthy();
  });

  it('should NOT grant Edit Product permission for Technician', () => {
    const permissionProvider = new PermissionProvider(
      technicianPermissionsMock,
    );

    expect(permissionProvider.canEditProduct()).toBeFalsy();
  });

  it('should NOT grant Edit Product permission for Distributor', () => {
    const permissionProvider = new PermissionProvider(
      distributorPermissionsMock,
    );

    expect(permissionProvider.canEditProduct()).toBeFalsy();
  });

  it('should grant Edit Product permission for MSO', () => {
    const permissionProvider = new PermissionProvider(msoPermissionsMock);

    expect(permissionProvider.canEditProduct()).toBeTruthy();
  });

  it('should grant Edit Product permission for Admin', () => {
    const permissionProvider = new PermissionProvider(adminPermissionsMock);

    expect(permissionProvider.canEditProduct()).toBeTruthy();
  });
});
