import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import { ProductResponse } from './api/productsAPI';

import {
  CurrentProductStoreType,
  ProductModel,
  StockProductStoreType,
} from '../stores/types';

interface FetchProductByScannedCodeContext {
  product?: ProductResponse;
}

export const fetchProductByScannedCode = async (
  store: CurrentProductStoreType & StockProductStoreType,
  scanCode: string,
) => {
  const productContext: FetchProductByScannedCodeContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductByScannedCodeTask(productContext, scanCode, store),
    new SaveProductToStoreTask(productContext, store),
  ]).execute();

  return result;
};

export class FetchProductByScannedCodeTask extends Task {
  productContext: FetchProductByScannedCodeContext;
  scanCode: string;
  stockStore?: StockProductStoreType;

  constructor(
    productContext: FetchProductByScannedCodeContext,
    scanCode: string,
    stockStore?: StockProductStoreType,
  ) {
    super();
    this.productContext = productContext;
    this.stockStore = stockStore;
    this.scanCode = scanCode;
  }

  async run(): Promise<void> {
    this.productContext.product = await getFetchProductAPI(
      this.scanCode,
      this.stockStore?.currentStock?.partyRoleId,
    );
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
    const { product } = this.productContext;

    this.currentProductStore.setCurrentProduct(
      product && this.mapProductResponse(product),
    );
  }

  private mapProductResponse(product: ProductResponse): ProductModel {
    const { manufactureCode, partNo, size, inventoryUseTypeId } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: getProductStepQty(inventoryUseTypeId),
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: product.isRecoverable === 'Yes',
    };
  }
}
