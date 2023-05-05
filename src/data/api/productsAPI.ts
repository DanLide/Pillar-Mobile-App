import { TransactionType } from '../../constants/common.enum';
import { ScanningProductModel } from '../../modules/removeProducts/stores/ScanningProductStore';
import { URLProvider, tryAuthFetch } from '../helpers';

export interface ProductResponse {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
  inventoryUseTypeId: number;
  size: string;
  partNo: string;
}

export interface RemoveProductResponse {
  qty: number;
  jobDetailed: number;
}

export const getFetchProductAPI = (scanCode: string) => {
  const url = new URLProvider().getFetchProductUrl(scanCode);

  return tryAuthFetch<ProductResponse>({ url, request: { method: 'GET' } });
};

export const removeProductAPI = (product: ScanningProductModel) => {
  const url = new URLProvider().removeProduct(
    product.productId,
    product.reservedCount,
    product.jobId || 0,
  );

  const body = JSON.stringify([
    {
      QuantityOriginal: '-' + product.reservedCount,
      TransactionTypeID: TransactionType.JobScan,
      Number: product.jobId || 0,
      Description: 'Remove Product',
    },
  ]);

  return tryAuthFetch<RemoveProductResponse>({
    url,
    request: { method: 'PUT', body },
  });
};
