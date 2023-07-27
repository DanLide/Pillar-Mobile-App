import { v1 as uuid } from 'uuid';

import { getProductMinQty, Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import {
  CategoryResponse,
  getCategoriesByFacilityIdAPI,
  getEnabledSuppliersByProductIdAPI,
  getProductSettingsByIdAPI,
  getSupplierListByFacilityIdAPI,
  ProductResponse,
  SupplierResponse,
} from './api/productsAPI';

import {
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../stores/types';

interface FetchProductByScannedCodeContext {
  product?: ProductResponse;

  categories: CategoryResponse[];
  suppliers: SupplierResponse[];
  enabledSuppliers: SupplierResponse[];
}

export const fetchProductByScannedCode = async (
  store: CurrentProductStoreType & StockProductStoreType,
  scanCode: string,
  fetchProductDetails?: boolean,
) => {
  const productContext: FetchProductByScannedCodeContext = {
    product: undefined,

    categories: [],
    suppliers: [],
    enabledSuppliers: [],
  };
  const result = await new TaskExecutor([
    new FetchProductByScannedCodeTask(
      productContext,
      scanCode,
      store,
      fetchProductDetails,
    ),
    new SaveProductToStoreTask(productContext, store),
  ]).execute();

  return result;
};

export class FetchProductByScannedCodeTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  scanCode: string;
  stockStore?: StockProductStoreType;
  fetchProductDetails?: boolean;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    scanCode: string,
    stockStore?: StockProductStoreType,
    fetchProductDetails?: boolean,
  ) {
    super();
    this.productContext = productContext;
    this.stockStore = stockStore;
    this.scanCode = scanCode;
    this.fetchProductDetails = fetchProductDetails;
  }

  async run(): Promise<void> {
    const product = await getFetchProductAPI(
      this.scanCode,
      this.stockStore?.currentStock,
    );

    if (!this.fetchProductDetails) {
      this.productContext.product = product;
      return;
    }

    this.productContext.categories = await getCategoriesByFacilityIdAPI();

    const { max, min, orderMultiple } = await getProductSettingsByIdAPI(
      product.productId,
      this.stockStore?.currentStock,
    );

    this.productContext.suppliers = await getSupplierListByFacilityIdAPI();

    this.productContext.enabledSuppliers =
      await getEnabledSuppliersByProductIdAPI(product.productId);

    this.productContext.product = {
      ...product,
      max,
      min,
      orderMultiple,
    };
  }
}

export class SaveProductToStoreTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  currentProductStore: CurrentProductStoreType;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    currentProductStore: CurrentProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.currentProductStore = currentProductStore;
  }

  async run(): Promise<void> {
    const { product, categories, suppliers, enabledSuppliers } =
      this.productContext;

    this.currentProductStore.setCategories(categories);
    this.currentProductStore.setSuppliers(suppliers);
    this.currentProductStore.setEnabledSuppliers(enabledSuppliers);

    this.currentProductStore.setCurrentProduct(
      product && this.mapProductResponse(product),
    );
  }

  private mapProductResponse(product: ProductResponse): ProductModel {
    const {
      manufactureCode,
      partNo,
      size,
      inventoryUseTypeId,
      inventoryClassificationTypeId,
      unitPer,
    } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: getProductMinQty(inventoryUseTypeId),
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: product.isRecoverable === 'Yes',
      categoryId: Number(inventoryClassificationTypeId),
      unitsPerContainer: unitPer,
    };
  }
}
