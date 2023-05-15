import { Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import {
  ScanningProductModel,
  ScanningProductStore,
} from '../modules/removeProducts/stores/ScanningProductStore';
import { ProductResponse } from './api/productsAPI';

interface FetchProductContext {
  product?: ProductResponse;
}

export const fetchProduct = async (
  scanningProductStore: ScanningProductStore,
  scanCode: string,
) => {
  const productContext: FetchProductContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductTask(productContext, scanCode),
    new SaveProductToStoreTask(productContext, scanningProductStore),
  ]).execute();

  return result;
};

class FetchProductTask extends Task {
  productContext: FetchProductContext;
  scanCode: string;

  constructor(productContext: FetchProductContext, scanCode: string) {
    super();
    this.productContext = productContext;
    this.scanCode = scanCode;
  }

  async run(): Promise<void> {
    const response = await getFetchProductAPI(this.scanCode);
    this.productContext.product = response;
  }
}

class SaveProductToStoreTask extends Task {
  productContext: FetchProductContext;
  scanningProductStore: ScanningProductStore;

  constructor(
    productContext: FetchProductContext,
    scanningProductStore: ScanningProductStore,
  ) {
    super();
    this.productContext = productContext;
    this.scanningProductStore = scanningProductStore;
  }

  async run(): Promise<void> {
    if (this.productContext.product) {
      this.scanningProductStore.setCurrentProduct(
        this.mapProductResponse(this.productContext.product),
      );
    }
  }

  private mapProductResponse(product: ProductResponse): ScanningProductModel {
    return {
      productId: product.productId,
      onHand: product.onHand,
      name: product.name,
      isRecoverable: product.isRecoverable === 'Yes',
      reservedCount: 1,
      inventoryUseTypeId: product?.inventoryUseTypeId,
      size: product.size,
      partNo: product.partNo,
      manufactureCode: product.manufactureCode,
    };
  }
}
