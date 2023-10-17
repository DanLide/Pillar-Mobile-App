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
