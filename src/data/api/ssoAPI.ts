import { MobileDevice } from 'src/stores/SSOStore';
import { URLProvider, tryAuthFetch, tryFetch } from '../helpers';

export interface SingleSSOAPIResponse {
  id: string;
  name: string;
  pisaId: string;
  msoId: string;
  distributorId: string;
  distributor: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

export type MultiSSOAPIResponse = Array<MultiSSOAPIObj>;

interface MultiSSOAPIObj {
  partyRoleId: string;
  name: string;
  address: string;
  msoId?: string;
  distributorId?: string;
  distributorName?: string;
}

export interface GetUnassignedDevicesResponse {
  AllowSSODiscountChange: boolean;
  CCCLicenseNumber: null;
  DROrderId: null;
  Discount: null;
  IsDistributorChanged: boolean;
  IsMobilePINCodeRequired: boolean;
  Permission: [];
  PrimaryContactpartyRelationshipType: [];
  branch: null;
  branchId: null;
  contractType: null;
  createdByUserB2CId: null;
  distributor: null;
  distributorId: null;
  distributorName: null;
  electronicAddress: [];
  isContractType: boolean;
  leanTecSerialNo: string;
  liquidMarkup: null;
  materialMarkup: null;
  modifiedByUserB2CId: null;
  msoId: null;
  name: string;
  parentPartyRoleId: number;
  partyIdentificationType: [];
  partyRelationshipType: [];
  partyRoleId: number;
  partySettingsType: [];
  postalAddress: [];
  roleTypeId: number;
  shopType: null;
  telecommunicationsNumber: [];
  territories: [];
}

interface RemoveDeviceFromSSOBody {
  partyRelationshipType: [
    { id: number; fromPartyRoleId: number; toPartyRoleId: number },
  ];
}

export const singleSSOAPI = (token: string, facilityID: string) => {
  const url = new URLProvider().getSingleSSOUrl(facilityID);

  url.search = decodeURIComponent(url.search);
  return tryFetch<SingleSSOAPIResponse>({
    url,
    request: {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    },
  });
};

export const multiSSOAPI = (token: string, msoID: string) => {
  const url = new URLProvider().getMultiSSOUrl(msoID);

  url.search = decodeURIComponent(url.search);

  return tryFetch<MultiSSOAPIResponse>({
    url,
    request: {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    },
  });
};

export const adminSSOAPI = (token: string) => {
  const url = new URLProvider().getAllSSOUrl();

  url.search = decodeURIComponent(url.search);

  return tryFetch<MultiSSOAPIResponse>({
    url,
    request: {
      method: 'GET',
      // TODO remove this
      headers: { authorization: `Bearer ${token}` },
    },
  });
};

export const distributorSSOAPI = (token: string, partyRoleId: number) => {
  const url = new URLProvider().getDistributorSSOUrl(partyRoleId);

  url.search = decodeURIComponent(url.search);

  return tryFetch<MultiSSOAPIResponse>({
    url,
    request: {
      method: 'GET',
      // TODO remove this
      headers: { authorization: `Bearer ${token}` },
    },
  });
};

export const shopSetupLoginAPI = (shopSetupCode: string) => {
  const url = new URLProvider().getShopSetupLoginUrl();

  return tryFetch<any>({
    url,
    request: { method: 'POST', body: JSON.stringify({ code: shopSetupCode }) },
  });
};

export const deviceByRepairFacilityIdAPI = () => {
  const url = new URLProvider().getDeviceByRepairFacilityIdUrl();

  return tryAuthFetch<MobileDevice[]>({
    url,
    request: {
      method: 'GET',
    },
  });
};

export const assignDeviceToSSOAPI = (deviceId: number) => {
  const url = new URLProvider().SSOAssignMobileDevice(deviceId);

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'PUT',
    },
  });
};

export const fetchUnassignedDevices = () => {
  const url = new URLProvider().getUnassignedDevices();

  return tryAuthFetch<GetUnassignedDevicesResponse[]>({
    url,
    request: {
      method: 'GET',
    },
  });
};

export const getRNTokenAPI = () => {
  const url = new URLProvider().getRNToken();

  return tryAuthFetch<{ token: string }>({
    url,
    request: {
      method: 'GET',
    },
  });
};

export const removeDeviceFromSSO = (
  id: string,
  body: RemoveDeviceFromSSOBody,
) => {
  const url = new URLProvider().removeDeviceFromSSO(id);

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  });
};
