import { action, makeObservable, observable } from 'mobx';
import { FacilityProductResponse } from '../../../data/api/productsAPI';

export class StockStore {
  @observable stocks: StockModel[];
  @observable facilityProducts: FacilityProductModel[];

  constructor() {
    this.stocks = [];
    this.facilityProducts = [];

    makeObservable(this);
  }

  @action setStocks(stocks: StockModel[]) {
    this.stocks = stocks.sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName),
    );
  }

  @action setFacilityProducts(products: FacilityProductModel[]) {
    this.facilityProducts = products;
  }

  @action updateFacilityProduct(product: FacilityProductModel) {
    this.facilityProducts = this.facilityProducts.map(currentProduct =>
      currentProduct.productId === product.productId ? product : currentProduct,
    );
  }

  public clear() {
    this.stocks = [];
    this.facilityProducts = [];
  }
}

export interface StockModel {
  organizationName: string;
  // isRelationshipExists: string;
  // organizationPartyRoleId: number;
  // isAssignedSupplyArea: number;
  // serialPartyRoleId: number;
  // onHand: number;
  // onOrder: number;
  // isActiveTransfer: number;
  // isAssignedToUser: number;
  partyRoleId: number;
  roleTypeId: number;
  leanTecSerialNo?: string;
  // roleTypeDescription: string;
  // dateAssigned: string;
}

export type FacilityProductModel = FacilityProductResponse;
