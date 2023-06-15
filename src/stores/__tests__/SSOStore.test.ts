import { ssoStore } from '..';

const mockSSOList = [
  {
    pisaId: 1,
    name: 'sso1',
  },
  {
    pisaId: 2,
    name: 'sso2',
  },
];

describe('SSOStore', () => {
  const store = ssoStore;

  it('should update ssoList on setSSOList and get getSSOList', () => {
    store.setSSOList(mockSSOList);
    expect(store.getSSOList).toBe(mockSSOList);
  });

  it('should update currentSSO on setCurrentSSO and get getCurrentSSO', () => {
    store.setCurrentSSO(mockSSOList[0]);
    expect(store.getCurrentSSO).toBe(mockSSOList[0]);
  });

  it('should clear store on clear', () => {
    store.clear();
    expect(store).toHaveProperty('currentSSO', undefined);
    expect(store).toHaveProperty('ssoList', undefined);
  });
});
