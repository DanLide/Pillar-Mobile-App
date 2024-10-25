import { action, makeObservable, observable, computed, override } from 'mobx';
import {
  includes,
  isNil,
  map,
  pipe,
  sum,
  forEach,
  keys,
  filter,
  difference,
} from 'ramda';
import { v1 as uuid } from 'uuid';

import { GetOrderDetailsResponse, GetOrdersAPIResponse } from 'src/data/api';
import { BaseProductsStore } from 'src/stores/BaseProductsStore';
import { ProductModel } from 'src/stores/types';
import { getProductTotalCost } from 'src/modules/orders/helpers';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';
import { GetOrderSummaryProduct } from 'src/data/api/orders';
import { getProductStepQty } from 'src/data/helpers';

export interface CurrentOrder extends Pick<GetOrderDetailsResponse, 'order'> {
  productList: ProductModel[];
}

const PRODUCT_MAX_COUNT = 9999;

export class OrdersStore extends BaseProductsStore {
  @observable currentOrder?: CurrentOrder;
  @observable orders?: GetOrdersAPIResponse[];
  @observable supplierId?: number;
  @observable currentStockName?: string;
  @observable backorderCabinets?: GetOrderSummaryProduct[];
  @observable cabinetSelection: boolean;
  @observable productUPC?: string;
  @observable comments?: string;

  constructor() {
    super();

    this.orders = undefined;
    this.supplierId = undefined;
    this.cabinetSelection = false;
    makeObservable(this);
  }

  @computed get getFilteredOrders() {
    return (filterValue: string) =>
      this.orders?.filter(
        item =>
          includes(filterValue.toLowerCase(), item.orderId.toString()) ||
          item.products.find(product =>
            includes(
              filterValue.toLowerCase(),
              product.product?.toLowerCase() || '',
            ),
          ),
      ) || [];
  }

  @computed get getCurrentProductsByStockName() {
    return this.currentOrder?.productList.filter(
      product => product.stockLocationName === this.currentStockName,
    );
  }

  @override get getMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @override get getEditableMaxValue() {
    return () => PRODUCT_MAX_COUNT;
  }

  @computed get getOrders() {
    return this.orders;
  }

  @computed get getCurrentOrder() {
    return this.currentOrder;
  }

  @computed get isProductItemsMissing() {
    if (isNil(this.getCurrentProductsByStockName)) return false;

    const isMissing = this.getCurrentProductsByStockName.reduce((acc, item) => {
      if (
        isNil(item.orderedQty) ||
        isNil(item.reservedCount) ||
        isNil(item.receivedQty)
      )
        return acc;

      if (item.orderedQty - item.reservedCount - item.receivedQty !== 0)
        acc = true;
      return acc;
    }, false);
    return !!isMissing;
  }

  @computed get isProductItemsMissingInMultipleStock() {
    if (isNil(this.currentOrder?.productList)) return false;

    const productsInOtherStocks = difference(
      this.currentOrder?.productList,
      this.getCurrentProductsByStockName || [],
    );

    const isMissing = productsInOtherStocks.reduce((acc, item) => {
      if (isNil(item.orderedQty) || isNil(item.receivedQty)) return acc;

      if (item.orderedQty - item.receivedQty !== 0) acc = true;
      return acc;
    }, false);

    return !!isMissing || this.isProductItemsMissing;
  }

  @computed get getTotalCost() {
    return pipe<[ProductModel[]], number[], number>(
      map(getProductTotalCost),
      sum,
    )(this.products);
  }

  @computed get getProductUPC() {
    return this.productUPC;
  }

  @computed get getCabinetSelection() {
    return this.cabinetSelection;
  }

  @computed get getProductByIdAndStorageId() {
    return (currentProduct: GetOrderSummaryProduct) => {
      return this.products.find(
        product =>
          product.productId === currentProduct.productId &&
          product.storageAreaId === currentProduct.storageAreaId,
      );
    };
  }

  @computed get getNotReceivedMultipleStockList() {
    if (isNil(this.currentOrder?.productList)) return [];

    const listOfStocks: { [name: string]: number } = {};

    forEach(product => {
      if (product.stockLocationId && !isNil(product.receivedQty)) {
        listOfStocks[product.stockLocationId] =
          (listOfStocks[product.stockLocationId]
            ? listOfStocks[product.stockLocationId]
            : 0) + product.receivedQty;
      }
    }, this.currentOrder?.productList);

    return keys(filter(count => count === 0, listOfStocks));
  }

  @action setCurrentOrder(orderDetails: CurrentOrder) {
    this.currentOrder = orderDetails;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }

  @action setCabinetSelection(value: boolean) {
    this.cabinetSelection = value;
  }

  @action setCurrentOrderProducts(products: ProductModel[]) {
    if (this.currentOrder) {
      this.currentOrder.productList = products;
    }
  }

  @action setSelectedProductsByStock(stockName: string) {
    this.currentStockName = stockName;
  }

  @action updateCurrentOrderProduct(product: ProductModel) {
    const products = this.currentOrder?.productList.map(currentProduct => {
      if (product.productId === currentProduct.productId) {
        return product;
      }
      return currentProduct;
    });
    if (this.currentOrder && products) {
      this.currentOrder.productList = products;
    }
  }

  @action setSupplier(supplierId?: number) {
    this.supplierId = supplierId;
  }

  @action setComments(comments: string) {
    this.comments = comments;
  }

  @action setPONumber(poNumber?: string) {
    if (this.currentOrder) this.currentOrder.order.customPONumber = poNumber;
  }

  @action setBackorderCabinets(cabinets: GetOrderSummaryProduct[]) {
    this.backorderCabinets = cabinets;
  }

  @action clearCreateOrReceiveBackOrder() {
    this.supplierId = undefined;
    this.clear();
  }

  @action setProductUPC(upc: string) {
    this.productUPC = upc;
  }

  @action updateProductByIdAndStorageId(currentProduct: ProductModel) {
    const products = this.products.map(product => {
      if (
        product.productId === currentProduct.productId &&
        product.storageAreaId === currentProduct.storageAreaId
      ) {
        product.reservedCount = currentProduct.reservedCount;
      }
      return product;
    });
    this.products = products;
  }

  @action updateCurrentProductStock(stock: StockModel) {
    const updatedProduct = {
      ...this.currentProduct,
      storageAreaName: stock.organizationName,
      storageAreaId: stock.partyRoleId,
    };
    const reservedCount =
      this.getProductByIdAndStorageId(updatedProduct)?.reservedCount ||
      getProductStepQty(this.currentProduct.inventoryUseTypeId);

    this.currentProduct = { ...updatedProduct, reservedCount };
  }

  @action addBackOrderProduct(product: ProductModel) {
    const removedProduct = { ...product, isRemoved: false, uuid: uuid() };
    this.products = [...this.products, removedProduct];
  }
}
