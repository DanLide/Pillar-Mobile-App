import { URLProvider, tryAuthFetch } from '../helpers';

export interface CreateInvoiceRequestBody {
  qty: number;
  productId: number;
}

export const createInvoiceAPI = (
  body: CreateInvoiceRequestBody[],
  jobId: number,
) => {
  const url = new URLProvider().createInvoice(jobId);
  const JSONbody = JSON.stringify(body);

  return tryAuthFetch<string[]>({
    url,
    request: {
      method: 'POST',
      body: JSONbody,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const createJobAPI = (
  jobNumber: string,
  description: string,
  partyRoleID?: number,
) => {
  const url = new URLProvider().createJob();

  const body = {
    assignedToPartyRoleID: '',
    integrationPlatformId: 1,
    jobCostClassificationTypeID: 1,
    jobId: 0,
    jobInformation: [
      {
        id: 1,
        description: description,
      },
      {
        id: 2,
        description: null,
      },
      {
        id: 3,
        description: '',
      },

      {
        id: 4,
        description: null,
      },
      {
        id: 5,
        description: null,
      },
    ],
    jobNumber: jobNumber,
    partyRoleID: partyRoleID,
  };

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  });
};

export const checkIsExistJobAPI = (jobNumber: string) => {
  const url = new URLProvider().isJobExist(jobNumber);

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'GET',
    },
  });
};
