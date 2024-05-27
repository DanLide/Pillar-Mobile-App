import { Utils } from '../../data/helpers/utils';
import { authStore } from '..';
import { stocksStore } from '../../modules/stocksList/stores';

jest.mock('../../modules/stocksList/stores');

const mockToken = 'mockToken';
const mockIsTnCSelected = true;
const mockIsLoggedIn = true;
const mockPartyRoleId = 10;
const mockUsername = 'mockUsername';
const mockCompanyNumber = 'mockCompanyNumber';
const mockPermissionSet = ['00', '01'];
const mockMsoID = 100;
const mockfFcilityID = 'mockfFcilityID';
const mockName = 'mockName';

describe('AuthStore', () => {
  const store = authStore;

  it('should update token on setToken and compute getToken', () => {
    store.setToken(mockToken);
    expect(store.getToken).toBe(mockToken);
  });

  it('should update isTnCSelected on setIsTnC and compute isTnCSelected', () => {
    store.setIsTnC(mockIsTnCSelected);
    expect(store.isTnCSelected).toBe(mockIsTnCSelected);
  });

  it('should update isLoggedIn on setLoggedIn and get store.isLoggedIn', () => {
    store.setLoggedIn(mockIsLoggedIn);
    expect(store.isLoggedIn).toBe(mockIsLoggedIn);
  });

  it('should update partyRoleId on setPartyRoleId and compute getPartyRoleId', () => {
    store.setPartyRoleId(mockPartyRoleId);
    expect(store.getPartyRoleId).toBe(mockPartyRoleId);
  });

  it('should update username on setUsername and get store.username', () => {
    store.setUsername(mockUsername);
    expect(store).toHaveProperty('username', mockUsername);
  });

  it('should update companyNumber on setCompanyNumber and get store.companyNumber', () => {
    store.setCompanyNumber(mockCompanyNumber);
    expect(store).toHaveProperty('companyNumber', mockCompanyNumber);
  });

  it('should update permissionSet on setPermissionSets and compute getPermissionSet', () => {
    store.setPermissionSets(mockPermissionSet);
    expect(store.getPermissionSet).toEqual(
      Utils.stringsToBigInts(mockPermissionSet),
    );
  });

  it('should update msoID on setMsoID and get store.msoID', () => {
    store.setMsoID(mockMsoID);
    expect(store).toHaveProperty('msoID', mockMsoID);
  });

  it('should update facilityID on setFacilityID and compute getFacilityID', () => {
    store.setFacilityID(mockfFcilityID);
    expect(store.getFacilityID).toBe(mockfFcilityID);
  });

  it('should update name on setName and compute getName', () => {
    store.setName(mockName);
    expect(store.getName).toBe(mockName);
  });

  it('should clear store and call stocksStore on logOut', () => {
    store.logOut();
    expect(store).toHaveProperty('token', undefined);
    expect(store).toHaveProperty('isTnC', undefined);
    expect(store).toHaveProperty('permissionSet', undefined);
    expect(store).toHaveProperty('isLoggedIn', false);
    expect(stocksStore.clear).toHaveBeenCalled();
  });

  it('should call logOut on onServerLogout', () => {
    const mockLogOut = jest.fn();
    store.logOut = mockLogOut;
    store.onServerLogout();
    expect(mockLogOut).toHaveBeenCalled();
  });

  it('should call logOut on onAutoLogout', () => {
    const mockLogOut = jest.fn();
    store.logOut = mockLogOut;
    store.onAutoLogout();
    expect(mockLogOut).toHaveBeenCalled();
  });
});
