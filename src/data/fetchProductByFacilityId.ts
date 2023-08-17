import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { getFetchProductByFacilityIdAPI } from './api';

import { ProductByFacilityIdResponse } from './api/productsAPI';

import { CurrentProductStoreType, ProductModel } from '../stores/types';
import { InventoryUseType } from '../constants/common.enum';

interface FetchProductByFacilityIdCodeContext {
  product?: ProductByFacilityIdResponse;
}

export const fetchProductByFacilityId = async (
  store: CurrentProductStoreType,
  scanCode: string,
) => {
  const productContext: FetchProductByFacilityIdCodeContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductByFacilityIdTask(productContext, scanCode),
    new SaveProductToStoreTask(productContext, store),
  ]).execute();

  return result;
};

export class FetchProductByFacilityIdTask extends Task {
  productContext: FetchProductByFacilityIdCodeContext;
  scanCode: string;

  constructor(
    productContext: FetchProductByFacilityIdCodeContext,
    scanCode: string,
  ) {
    super();
    this.productContext = productContext;
    this.scanCode = scanCode;
  }

  async run(): Promise<void> {
    const response = await getFetchProductByFacilityIdAPI(this.scanCode);
    this.productContext.product = response[0];
  }
}

export class SaveProductToStoreTask extends Task {
  productContext: FetchProductByFacilityIdCodeContext;
  currentProductStore: CurrentProductStoreType;

  constructor(
    productContext: FetchProductByFacilityIdCodeContext,
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

  private mapProductResponse(
    product: ProductByFacilityIdResponse,
  ): ProductModel {
    const { manufacturer, partNumber, size, removedBy } = product;
    const inventoryUseTypeId =
      removedBy === 'Percent'
        ? InventoryUseType.Percent
        : InventoryUseType.Container;

    return {
      uuid: uuid(),
      isRemoved: false,
      reservedCount: getProductStepQty(inventoryUseTypeId),
      nameDetails: [manufacturer, partNumber, size].join(' '),
      job: undefined,
      isRecoverable: product.isRecoverable,
      productId: product.pisaId,
      name: product.description,
      onHand: 999, // TODO
      inventoryUseTypeId,
      size: product.size,
      partNo: product.partNumber,
      manufactureCode: product.manufacturer,
    };
  }
}
