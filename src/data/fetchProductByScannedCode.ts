import { Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import {
  ScanningProductModel,
  ScanningProductStore,
} from '../modules/removeProducts/stores/ScanningProductStore';
import { ProductResponse } from './api/productsAPI';

interface FetchProductByScannedCodeContext {
  product?: ProductResponse;
}

export const fetchProductByScannedCode = async (
  scanningProductStore: ScanningProductStore,
  scanCode: string,
) => {
  const productContext: FetchProductByScannedCodeContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductByScannedCodeTask(productContext, scanCode),
    new SaveProductToStoreTask(productContext, scanningProductStore),
  ]).execute();

  return result;
};

class FetchProductByScannedCodeTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  scanCode: string;

  constructor(productContext: FetchProductByScannedCodeContext, scanCode: string) {
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
  productContext: FetchProductByScannedCodeContext;
  scanningProductStore: ScanningProductStore;

  constructor(
    productContext: FetchProductByScannedCodeContext,
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
    const { manufactureCode, partNo, size } = product;

    return {
      ...product,
      isRecoverable: product.isRecoverable === 'Yes',
      nameDetails: [manufactureCode, partNo, size].join(' '),
      reservedCount: 1,
    };
  }
}
