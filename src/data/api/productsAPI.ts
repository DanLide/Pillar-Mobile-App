import { TransactionType } from '../../constants/common.enum';
import { ProductModel } from '../../stores/types';
import { URLProvider, tryAuthFetch } from '../helpers';

export interface ProductResponse {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
  inventoryUseTypeId: number;
  size: string;
  partNo: string;
  manufactureCode: string;
  nameDetails: string;
}

export interface RemoveProductResponse {
  qty: number;
  jobDetailed: number;
}

export const getFetchProductAPI = (scanCode: string) => {
  const url = new URLProvider().getFetchProductUrl(scanCode);

  return tryAuthFetch<ProductResponse>({ url, request: { method: 'GET' } });
};

export const removeProductAPI = (product: ProductModel) => {
  const url = new URLProvider().removeProduct(
    product.productId,
    product.reservedCount,
    product.job?.jobId,
  );

  const body = JSON.stringify([
    {
      QuantityOriginal: '-' + product.reservedCount,
      TransactionTypeID: TransactionType.JobScan,
      Number: product.job?.jobId || 0,
      Description: 'Remove Product',
    },
  ]);

  return tryAuthFetch<RemoveProductResponse>({
    url,
    request: { method: 'PUT', body },
  });
};
