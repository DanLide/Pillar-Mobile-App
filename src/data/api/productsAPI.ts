import {
  InventoryAdjusmentType,
  TransactionType,
} from '../../constants/common.enum';
import { ProductModel } from '../../stores/types';
import { URLProvider, tryAuthFetch } from '../helpers';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';

export interface ProductSettingsResponse {
  max?: number;
  min?: number;
  orderMultiple?: number;
}

export interface ProductResponse extends ProductSettingsResponse {
  productId: number;
  name: string;
  isRecoverable: 'Yes' | 'No';
  onHand: number;
  inventoryUseTypeId: number;
  size: string;
  partNo: string;
  manufactureCode: string;
  nameDetails: string;
  unitPer: number;
  inventoryClassificationTypeId: string;
  inventoryAssignmentId?: number;
  supplierPartyRoleId?: number;
  onOrder?: number;
  upc?: string;
  min?: number;
  max?: number;
}

export interface CategoryResponse {
  id: number;
  description: string;
}

export interface SupplierResponse {
  name: string;
  partyRoleId: number;
}

export interface RemoveProductResponse {
  qty: number;
  jobDetailed: number;
}

export interface ProductByFacilityIdResponse {
  pisaId: number;
  pillarID: string;
  supplierID: number;
  partNumber: string;
  manufacturer: string;
  description: string;
  invoiceUnit: string;
  unit: string;
  isRecoverable: boolean;
  size: string;
  dimension: number;
  price: number;
  primaryCategoryId: number;
  secondaryCategoryId: number;
  categories: [
    {
      primaryCategoryId: number;
      secondaryCategoryId: number;
    },
  ];
  itemMaster: {
    partNumber: string;
    manufacturer: string;
  };
  category: string;
  removedBy: string;
  repairFacilityID: number;
}

export const getFetchProductAPI = (
  scanCode: string,
  currentStock?: StockModel,
) => {
  const url = new URLProvider().getFetchProductUrl(scanCode, currentStock);

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

export const returnProductAPI = ({
  productId,
  reservedCount,
}: ProductModel) => {
  const url = new URLProvider().returnProduct(productId, reservedCount);

  const body = JSON.stringify([
    {
      TransactionTypeID: TransactionType.JobScan,
      Description: 'Product Return',
    },
  ]);

  return tryAuthFetch<string>({
    url,
    request: { method: 'PUT', body },
  });
};

export const getFetchProductByFacilityIdAPI = (scanCode: string) => {
  const url = new URLProvider().getFetchProductByFacilityId(scanCode);

  return tryAuthFetch<ProductByFacilityIdResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const getCategoriesByFacilityIdAPI = () => {
  const url = new URLProvider().getCategoriesByFacilityId();

  return tryAuthFetch<CategoryResponse[]>({ url, request: { method: 'GET' } });
};

export const getProductSettingsByIdAPI = (
  productId: number,
  currentStock?: StockModel,
) => {
  const url = new URLProvider().getProductSettingsById(productId, currentStock);

  return tryAuthFetch<ProductSettingsResponse>({
    url,
    request: { method: 'GET' },
  });
};

export const getSupplierListByFacilityIdAPI = () => {
  const url = new URLProvider().getSupplierListByFacilityId();

  return tryAuthFetch<SupplierResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const getEnabledSuppliersByProductIdAPI = (productId: number) => {
  const url = new URLProvider().getEnabledSuppliersByProductId(productId);

  return tryAuthFetch<SupplierResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const updateProductQuantityAPI = (
  product?: ProductModel,
  currentStock?: StockModel,
) => {
  const url = new URLProvider().updateProductQuantity();

  const body = JSON.stringify([
    {
      partyRoleId: currentStock?.partyRoleId,
      productId: product?.productId,
      inventoryAssignmentId: product?.inventoryAssignmentId,
      quantityOriginal: product?.onHand,
      quantityCounted: product?.reservedCount,
      transactionTypeId: TransactionType.Adjustment,
      inventoryAdjustmentTypeId: InventoryAdjusmentType.Normal,
    },
  ]);

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};
