import { v1 as uuid } from 'uuid';

import { Task, TaskExecutor, getProductMinQty } from './helpers';
import { getFetchProductAPI } from './api';

import { ProductResponse } from './api/productsAPI';

import { CurrentProductStoreType, ProductModel } from '../stores/types';

interface FetchProductByScannedCodeContext {
  product?: ProductResponse;
}

export const fetchProductByScannedCode = async (
  currentProductStore: CurrentProductStoreType,
  scanCode: string,
) => {
  const productContext: FetchProductByScannedCodeContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductByScannedCodeTask(productContext, scanCode),
    new SaveProductToStoreTask(productContext, currentProductStore),
  ]).execute();

  return result;
};

class FetchProductByScannedCodeTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  scanCode: string;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    scanCode: string,
  ) {
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
    if (this.productContext.product) {
      this.currentProductStore.setCurrentProduct(
        this.mapProductResponse(this.productContext.product),
      );
    }
  }

  private mapProductResponse(product: ProductResponse): ProductModel {
    const { manufactureCode, partNo, size, inventoryUseTypeId } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: getProductMinQty(inventoryUseTypeId),
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: product.isRecoverable === 'Yes',
    };
  }
}
