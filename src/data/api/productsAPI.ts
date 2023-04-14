import { URLProvider, tryAuthFetch } from '../helpers';

export interface ProductResponseModel {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
}

export const getFetchProductAPI = (scanCode: string) => {
  const url = new URLProvider().getFetchProductUrl(scanCode);

  return tryAuthFetch<ProductResponseModel>({ url, request: { method: 'GET' } });
};
