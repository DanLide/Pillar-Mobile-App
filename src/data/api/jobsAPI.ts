import { URLProvider, tryAuthFetch } from '../helpers';
import { ProductModel } from 'src/stores/types';

export interface JobResponse {
  jobId: number;
  jobNumber: string;
  jobDescription?: string;
  status: 'OPEN' | 'CLOSE';
  extCost?: number;
  extPrice?: number;
  inventoryAssignmentId?: number;
  isRecoverable?: string;
  isTaxable?: number;
  jobDetailId?: number;
  onHand?: number;
  productID?: number;
  qty?: number;
  tax?: number;
  unitCost?: number;
}

export interface JobDetailQuantity {
  productID?: number;
  jobId?: number;
  qty?: number;
  extCost?: number;
  extPrice?: number;
  jobDetailId: number;
  unitCost?: number;
  inventoryAssignmentId?: number;
  onHand?: number;
  isTaxable?: number;
  tax?: number;
}

export const getFetchJobsAPI = () => {
  const url = new URLProvider().getFetchJobsBySso();

  return tryAuthFetch<JobResponse[]>({ url, request: { method: 'GET' } });
};

export const getFetchJobsByProductAPI = (
  productId: number,
  partyRoleId = 0,
) => {
  const url = new URLProvider().getFetchJobsByProductUrl(
    productId,
    partyRoleId,
  );

  return tryAuthFetch<JobResponse[]>({ url, request: { method: 'GET' } });
};

export const getFetchJobDetailQuantityAPI = ({
  productId,
  partyRoleId = 0,
  job,
}: ProductModel) => {
  const url = new URLProvider().getFetchJobDetailQuantityUrl(
    job?.jobId || 0,
    partyRoleId,
    productId,
  );

  return tryAuthFetch<JobDetailQuantity>({ url, request: { method: 'GET' } });
};
