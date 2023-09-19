import { action, makeObservable, observable, computed } from 'mobx';

import {
  GetOrderDetailsResponse,
  GetOrdersAPIResponse,
} from '../../../data/api';
import { BaseProductsStore } from '../../../stores/BaseProductsStore';
import { ProductModel } from '../../../stores/types';

interface CurrentOrder extends Pick<GetOrderDetailsResponse, 'order'> {
  productList: ProductModel[];
}

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

  @computed get getOrders() {
    return this.orders;
  }

  @computed get getCurrentOrder() {
    return this.currentOrder;
  }

  @computed get isProductItemsMissing() {
    const isMissing = this.currentOrder?.productList.reduce((acc, item) => {
      if (item.orderedQty - item.receivedQty !== 0) acc = true;
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
}
