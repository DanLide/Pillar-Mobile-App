import { ProductResponse } from '../../data/api/productsAPI';
import { JobModel } from '../../modules/jobsList/stores/JobsStore';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';

export interface ProductModel extends Omit<ProductResponse, 'isRecoverable'> {
  uuid: string;
  isRemoved: boolean;
  reservedCount: number;
  nameDetails: string;
  job?: JobModel;
  isRecoverable: boolean;
}

export interface ClearStoreType {
  clear: () => void;
}

export interface CurrentProductStoreType<
  T extends ProductModel = ProductModel,
> {
  getCurrentProduct?: T;
  setCurrentProduct: (product: T) => void;
  removeCurrentProduct: () => void;
}

export interface ScannerModalStoreType<T extends ProductModel = ProductModel> {
  getProducts: T[];
  getScannedProductsCountByProductId: (productId: number) => number;
  getEditableMaxValue: (product: T) => number;
  getMaxValue: (product: T) => number;

  setEditableProductQuantity: (quantity: number) => void;
  addProduct: (product: T) => void;
  updateProduct: (product: T) => void;
  removeProduct: (product: T) => void;
}

export interface SyncedProductStoreType<T extends ProductModel = ProductModel> {
  getSyncedProducts: T[];
  getNotSyncedProducts: T[];
}

export interface StockProductStoreType {
  currentStock?: StockModel;
  setCurrentStocks: (stock: StockModel) => void;
}