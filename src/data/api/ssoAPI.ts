import { URLProvider, tryFetch } from '../helpers';

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

export const singleSSOAPI = (token: string, facilityID: string) => {
  const url = new URLProvider().getSingleSSOUrl(facilityID);

  url.search = decodeURIComponent(url.search);
  return tryFetch<SingleSSOAPIResponse>({
    url,
    request: {
      method: 'GET',
      // TODO remove this
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
      // TODO remove this
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
