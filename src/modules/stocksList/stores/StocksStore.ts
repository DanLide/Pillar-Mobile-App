import { action, makeObservable, observable } from 'mobx';
import {
  CategoryResponse,
  FacilityProductResponse,
  SupplierResponse,
} from '../../../data/api/productsAPI';
import masterLockStore from '../../../stores/MasterLockStore';

export class StockStore {
  @observable stocks: StockModel[];
  @observable facilityProducts: FacilityProductModel[];
  @observable categories: CategoryModel[];
  @observable suppliers: SupplierModel[];
  @observable enabledSuppliers: SupplierModel[];

  constructor() {
    this.stocks = [];
    this.facilityProducts = [];
    this.categories = [];
    this.suppliers = [];
    this.enabledSuppliers = [];

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

  @action setCategories(categories: CategoryModel[]) {
    this.categories = categories;
  }

  @action setSuppliers(suppliers: SupplierModel[]) {
    this.suppliers = suppliers;
  }

  @action setEnabledSuppliers(enabledSuppliers: SupplierModel[]) {
    this.enabledSuppliers = enabledSuppliers;
  }

  public clear() {
    this.stocks = [];
    this.facilityProducts = [];
    this.categories = [];
    this.suppliers = [];
    this.enabledSuppliers = [];
  }
}

// !!!!!!!!!!!! TODO rename deviceId, accessProfile, firmwareVersion due to the API changes. And remove this comment afterall
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
  deviceId: string; 
  roleTypeId: number;
  leanTecSerialNo?: string;
  accessProfile: string;
  firmwareVersion: number;
  // roleTypeDescription: string;
  // dateAssigned: string;
}

export type FacilityProductModel = FacilityProductResponse;
export type CategoryModel = CategoryResponse;
export type SupplierModel = SupplierResponse;
