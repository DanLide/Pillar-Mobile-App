import { ProductResponse } from '../../data/api/productsAPI';
import { JobModel } from '../../modules/jobsList/stores/JobsStore';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';

export interface ProductModel
  extends Omit<
    ProductResponse,
    'isRecoverable' | 'inventoryClassificationTypeId' | 'unitPer'
  > {
  uuid: string;
  isRemoved: boolean;
  reservedCount?: number;
  nameDetails: string;
  isRecoverable: boolean;
  categoryId?: number;
  unitsPerContainer?: number;
  job?: JobModel;
  product?: string;
  unitPer?: number;
  unitsPer?: number;
  shippedQty?: number;
  cost?: number;
  receivedQty?: number;
  orderedQty?: number;
  extQty?: number;
  quantityOnHand?: number;
  extCost?: number;
  isTaxable?: boolean;
  receivableQty?: number;
  markup?: number;
  inventoryAssignmentTypeId?: number;
  consignmentQty?: number;
  tax?: number;
  storageAreaId?: number;
  stockLocationName?: string;
  stockLocationId?: string;
  storageAreaName?: string;
  inventoryById?: number;
  partyRoleId?: number;
}

export interface ClearStoreType {
  clear: () => void;
}

export interface CurrentProductStoreType<
  T extends ProductModel = ProductModel,
> {
  getCurrentProduct?: T;
  lastSelectedJob?: JobModel;
  productJobs?: { [key: number]: JobModel[] };
  productJobDetails?: JobModel;
  setCurrentProduct: (product?: T) => void;
  setJobToCurrentProduct: (jobNumber: string) => void;
  setProductJobs: (productId: number, jobs: JobModel[]) => void;
  removeCurrentProduct: () => void;
}

export interface ScannerModalStoreType<T extends ProductModel = ProductModel> {
  getProducts: T[];
  getScannedProductsCountByProductId: (productId: number) => number;
  getEditableMaxValue: (product: T) => number;
  getMaxValue: (product: T) => number;
  getOnHand: (product: T) => number;
  getEditableOnHand: (product: T) => number;

  setEditableProductQuantity: (quantity: number) => void;
  addProduct: (product: T) => void;
  setProducts: (product: T[]) => void;
  updateProduct: (product: T) => void;
  removeProduct: (product: T) => void;
}

export interface SyncedProductStoreType<T extends ProductModel = ProductModel> {
  getSyncedProducts: T[];
  getNotSyncedProducts: T[];
}

export interface StockProductStoreType {
  currentStock?: StockModel;
  stockName?: string;
  setCurrentStocks: (stock: StockModel) => void;
}
