import { v1 as uuid } from 'uuid';

import { getProductStepQty, Task, TaskExecutor } from './helpers';
import { ProductModel } from '../stores/types';
import { OrdersStore } from '../modules/orders/stores/OrdersStore';
import {
  GetOrderSummaryProduct,
  getProductByOrderTypeAndSupplierAPI,
  getProductMultipleStocks,
} from './api/orders';
import { BadRequestError } from './helpers/tryFetch';
import {
  getFetchProductByFacilityIdAPI,
  getFetchProductsByFacilityIdAPI,
} from './api';
import { stocksStore } from '../modules/stocksList/stores';

interface FetchProductByOrderTypeAndSupplierContext {
  product?: GetOrderSummaryProduct;
}

export enum ProductByOrderTypeAndSupplierError {
  NotAssignedToDistributor = 'NotAssignedToDistributor',
  NotAssignedToStock = 'NotAssignedToStock',
}

export const getProductBySupplierWithStocks = async (
  store: OrdersStore,
  scanCode: string,
) => {
  const productContext: FetchProductByOrderTypeAndSupplierContext = {
    product: undefined,
  };
  const result = await new TaskExecutor([
    new FetchProductByOrderTypeAndSupplier(productContext, scanCode, store),
  ]).execute();

  return result;
};

const getProductSupplier = async (code: string) => {
  const supplierId = stocksStore.getSupplierIdByUpc(code);

  if (supplierId) return supplierId;

  const product = await getFetchProductByFacilityIdAPI(code.replace('~~', ''));

  return product?.[0].supplierId;
};

export class FetchProductByOrderTypeAndSupplier extends Task {
  productContext: FetchProductByOrderTypeAndSupplierContext;
  scanCode: string;
  store: OrdersStore;
  constructor(
    productContext: FetchProductByOrderTypeAndSupplierContext,
    scanCode: string,
    store: OrdersStore,
  ) {
    super();
    this.productContext = productContext;
    this.scanCode = scanCode;
    this.store = store;
  }

  async run(): Promise<void> {
    const productSupplier = await getProductSupplier(this.scanCode);
    if (!this.store.supplierId) {
      this.store.setSupplier(productSupplier);
    }

    const selectedSupplier = this.store.supplierId;
    if (!productSupplier) return;
    if (selectedSupplier !== productSupplier) {
      const supplierName = stocksStore.getSupplierNameById(productSupplier);

      throw new BadRequestError(
        ProductByOrderTypeAndSupplierError.NotAssignedToDistributor,
        supplierName,
      );
    }

    const products = await getFetchProductsByFacilityIdAPI();
    const productUPC = products?.find(
      product => product.productId === +this.scanCode.replace('~~', ''),
    ).upc;

    const productMultipleStockLocations = await getProductMultipleStocks(
      productUPC,
    );
    const product = await getProductByOrderTypeAndSupplierAPI(this.scanCode);

    if (productMultipleStockLocations?.length > 1) {
      this.store.setBackorderCabinets(productMultipleStockLocations);
      this.store.setCabinetSelection(true);
      this.store.setProductUPC(productUPC);
      this.store.setCurrentProduct(
        this.mapProductResponse(product, productUPC),
      );
    } else {
      this.store.setCabinetSelection(false);
      this.store.setProductUPC(undefined);
      const availableStocks =
        stocksStore.stocks.filter(stock =>
          product?.cabinets.find(
            cabinet => stock.partyRoleId === cabinet.storageAreaId,
          ),
        ) || [];
      this.store.setCurrentStocks(availableStocks[0]);
      this.store.setCurrentProduct(
        this.mapProductResponse(product, productUPC),
      );
    }
  }
  private mapProductResponse(
    product: GetOrderSummaryProduct,
    upc: string,
  ): ProductModel {
    const { inventoryUseTypeId, manufactureCode, partNo, size } = product;

    return {
      ...product,
      isRemoved: false,
      reservedCount: getProductStepQty(inventoryUseTypeId),
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: false,
      upc,
    };
  }
}
