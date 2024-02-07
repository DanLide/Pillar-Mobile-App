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
import { checkUPC } from 'src/helpers/isUPC';

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
    const productUPC = this.getUpcCode(products, this.scanCode);

    let productMultipleStockLocations = [];
    if (productUPC) {
      productMultipleStockLocations = await getProductMultipleStocks(
        productUPC,
      );
    }

    const productId = products.find(product => {
      if (checkUPC(this.scanCode)) {
        return product.productId === productMultipleStockLocations[0].productId;
      } else {
        return product.productId === +this.scanCode.replace('~~', '');
      }
    })?.productId;

    const product = await getProductByOrderTypeAndSupplierAPI(`~~${productId}`);

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
          productMultipleStockLocations?.cabinets?.find(
            cabinet => stock.partyRoleId === cabinet.storageAreaId,
          ),
        ) || [];
      this.store.setCurrentStocks(availableStocks[0]);
      this.store.setCurrentProduct(
        this.mapProductResponse(product, productUPC, true),
      );
    }
  }

  private getUpcCode(products: ProductModel[], scanCode: string) {
    const isUpc = checkUPC(scanCode);
    if (isUpc) {
      return scanCode;
    } else {
      return products.find(
        product => product.productId === +this.scanCode.replace('~~', ''),
      ).upc;
    }
  }

  private mapProductResponse(
    product: GetOrderSummaryProduct,
    upc: string,
    isSingleStockLocation?: boolean,
  ): ProductModel {
    const { inventoryUseTypeId, manufactureCode, partNo, size } = product;
    const reservedCount = isSingleStockLocation
      ? this.store.getProductByIdAndStorageId(product)?.reservedCount ||
        getProductStepQty(inventoryUseTypeId)
      : getProductStepQty(inventoryUseTypeId);
    return {
      ...product,
      isRemoved: false,
      reservedCount,
      nameDetails: [manufactureCode, partNo, size].join(' '),
      uuid: uuid(),
      isRecoverable: false,
      upc,
    };
  }
}
