import { action, makeObservable, observable, computed, override } from 'mobx';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';
import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';

interface CurrentOrder extends Pick<GetOrderDetailsResponse, 'order'> {
  productList: ProductModel[];
}

const PRODUCT_MAX_COUNT = 9999;

export class OrdersStore extends BaseProductsStore {
  @observable currentOrder?: CurrentOrder;
  @observable orders?: GetOrdersAPIResponse[];
  @observable supplierId?: number;

  constructor() {
    super();

    this.orders = undefined;
    this.supplierId = undefined;
    makeObservable(this);
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
    const isMissing = this.currentOrder?.productList.reduce((acc, item) => {
      if ((item.orderedQty ?? 0) - (item.receivedQty ?? 0) !== 0) acc = true;
      return acc;
    }, false);
    return !!isMissing;
  }

  @action setCurrentOrder(orderDetails: CurrentOrder) {
    this.currentOrder = orderDetails;
  }

  @action setOrders(orders: GetOrdersAPIResponse[]) {
    this.orders = orders;
  }

  @action setCurrentOrderProducts(products: ProductModel[]) {
    if (this.currentOrder) {
      this.currentOrder.productList = products;
    }
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

  @action clearCreateOrder() {
    this.supplierId = undefined;
    this.clear();
  }
}
