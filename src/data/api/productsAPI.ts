import {
  InventoryAdjusmentType,
  TransactionType,
} from '../../constants/common.enum';
import { ProductModel } from '../../stores/types';
import { URLProvider, tryAuthFetch } from '../helpers';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';
import { assoc, find, pipe, whereEq } from 'ramda';
import { stocksStore } from '../../modules/stocksList/stores';

export interface ProductSettingsResponse {
  max?: number;
  min?: number;
  orderMultiple?: number;
  replenishedFormId?: number;
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
  nameDetails?: string;
  unitPer: number;
  inventoryClassificationTypeId: string;
  inventoryAssignmentId?: number;
  supplierPartyRoleId?: number;
  onOrder?: number;
  upc?: string;
  min?: number;
  max?: number;
}

export type FacilityProductResponse = Pick<
  ProductResponse,
  'productId' | 'upc' | 'orderMultiple' | 'supplierPartyRoleId'
>;

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
  supplierId: number;
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
  productId?: number,
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

export const getEnabledSuppliersByProductIdAPI = (productId?: number) => {
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

export const updateProductSettingsAPI = (product?: ProductModel) => {
  const url = new URLProvider().updateProductSettings(product?.productId);

  const body = JSON.stringify({
    ProductID: product?.productId,
    UPC: product?.upc,
    InventoryUseTypeID: product?.inventoryUseTypeId.toString(),
    UnitPer: product?.unitsPerContainer,
    SupplierPartyRoleID: product?.supplierPartyRoleId,
    InventoryClassificationTypeID: product?.categoryId,
    IsRecoverable: product?.isRecoverable,
  });

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

export const updateProductAreaSettingsAPI = (
  product?: ProductModel,
  stockId?: number,
  facilityId?: number,
) => {
  const url = new URLProvider().updateProductAreaSettings();

  const body = JSON.stringify({
    productId: product?.productId,
    partyRoleId: facilityId,
    min: product?.min,
    max: product?.max,
    replenishedFormId: product?.replenishedFormId,
    StorageAreaId: stockId,
    InventoryAssignmentId: product?.inventoryAssignmentId,
  });

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const updateProductOrderMultipleAPI = (product?: ProductModel) => {
  const url = new URLProvider().updateProductOrderMultiple();

  const facilityProduct = pipe(
    find(whereEq({ productId: product?.productId })),
    assoc('orderMultiple', product?.orderMultiple),
  )(stocksStore.facilityProducts);

  const body = JSON.stringify([facilityProduct]);

  return tryAuthFetch<string>({
    url,
    request: {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const getFacilityProducts = () => {
  const url = new URLProvider().getFacilityProducts();

  return tryAuthFetch<FacilityProductResponse[]>({
    url,
    request: { method: 'GET' },
  });
};
