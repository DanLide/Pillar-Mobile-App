import { URLProvider, tryAuthFetch } from '../helpers';

export interface CreateInvoiceRequestBody {
  product: string;
  inventoryAssignmentId: number;
  productId: number;
  manufactureCode: string;
  partNo: string;
  size: string;
  name: string;
  jobPrice: number;
  supplierPartyRoleId: number;
  supplier: string;
  onHand: number;
  extCost: number;
  extPrice: number;
  unitCost: number;
  isTaxable: number;
  isRecoverable: string;
  jobID: number;
  jobNumber: string;
  qty: number;
  jobDetailID: number;
  type: string;
  description: string;
  inventoryTransactionID: number;
  tax: number;
  status: string;
}

// TODO https://dev.azure.com/3M-Bluebird/Pillar/_workitems/edit/113299
export const createInvoiceAPI = (body: CreateInvoiceRequestBody[]) => {
  const url = new URLProvider().createInvoice(body[0].jobID);
  console.log(url, 'url create invoice');

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
