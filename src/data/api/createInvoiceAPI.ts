import { ProductModel } from '../../stores/types';
import { URLProvider, tryAuthFetch } from '../helpers';

export interface CreateInvoiceRequestBody extends ProductModel {
  qty: number;
  jobID: number;
  jobNumber: string;
}

export const createInvoiceAPI = (body: CreateInvoiceRequestBody[]) => {
  const url = new URLProvider().createInvoice(body[0].jobID);

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
