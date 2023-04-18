import { URLProvider, tryAuthFetch } from '../helpers';

export interface ProductResponse {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
}

export const getFetchProductAPI = (scanCode: string) => {
  const url = new URLProvider().getFetchProductUrl(scanCode);

  return tryAuthFetch<ProductResponse>({ url, request: { method: 'GET' } });
};
