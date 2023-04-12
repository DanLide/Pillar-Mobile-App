import { Task, TaskExecutor } from './helpers';
import { getFetchProductAPI } from './api';

import {
  ProductJobModel,
  ProductJobStore,
} from '../modules/removeProducts/stores/ProductJobStore';
import { ProductModel } from './api/productsAPI';

interface FetchProductContext {
  product?: ProductModel;
}

export const fetchProduct = async (
  productJobStore: ProductJobStore,
  scanCode: string,
) => {
  const productContext: FetchProductContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductTask(productContext, scanCode),
    new SaveProductToStoreTask(productContext, productJobStore),
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
  productJobStore: ProductJobStore;

  constructor(
    productContext: FetchProductContext,
    productJobStore: ProductJobStore,
  ) {
    super();
    this.productContext = productContext;
    this.productJobStore = productJobStore;
  }

  async run(): Promise<void> {
    if (this.productContext.product) {
      this.productJobStore.setCurrentProduct(this.productContext.product);
    }
  }
}
