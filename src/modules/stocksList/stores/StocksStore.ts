import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { find, pipe, prop, propEq, whereEq } from 'ramda';
import { getFetchStockByDeviceNameAPI } from 'src/data/api';

import {
  CategoryResponse,
  FacilityProductResponse,
  SupplierResponse,
} from 'src/data/api/productsAPI';
import { LoggingService } from 'src/services';

export class StockStore {
  @observable stocks: ExtendedStockModel[] = [];
  @observable facilityProducts: FacilityProductModel[] = [];
  @observable categories: CategoryModel[] = [];
  @observable suppliers: SupplierModel[] = [];
  @observable enabledSuppliers: SupplierModel[] = [];
  @observable SSOStocks: ExtendedStockModel[] = [];

  constructor() {
    makeObservable(this);
  }

  static isStockWithMLAccess(
    stock: StockModel | StockModelWithMLAccess,
  ): stock is StockModelWithMLAccess {
    return !!(stock as StockModelWithMLAccess).equipment;
  }

  @computed get getSupplierNameById() {
    return (supplierId: number): string | undefined =>
      pipe(
        find(propEq('partyRoleId', supplierId)),
        prop('name'),
      )(this.suppliers);
  }

  @computed get getSupplierIdByUpc() {
    return (upc: string) =>
      pipe(
        find(whereEq({ upc })),
        prop('supplierPartyRoleId'),
      )(this.facilityProducts);
  }

  @computed get getMasterlockStocks() {
    return this.stocks.filter(
      stock => stock.controllerSerialNo && stock.controllerType === 'ML',
    );
  }

  @action setStocks(stocks: (StockModel | StockModelWithMLAccess)[]) {
    const mappedStocks = stocks.map(stockItem =>
      StockStore.isStockWithMLAccess(stockItem)
        ? {
            ...stockItem.equipment,
            ...stockItem.mlAccessData,
          }
        : stockItem,
    );
    this.stocks = mappedStocks.sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName),
    );
  }

  @computed get suppliersRenderFormat() {
    return this.suppliers.map(item => ({
      label: item.name,
      value: item.partyRoleId,
    }));
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

  async fetchSSOStocks() {
    try {
      const stocks = (await getFetchStockByDeviceNameAPI()) ?? [];
      const mappedStocks = stocks
        .map(stockItem =>
          StockStore.isStockWithMLAccess(stockItem)
            ? {
                ...stockItem.equipment,
                ...stockItem.mlAccessData,
              }
            : stockItem,
        )
        .sort((a, b) => a.organizationName.localeCompare(b.organizationName));
      runInAction(() => {
        this.SSOStocks = mappedStocks;
      });
    } catch (err) {
      LoggingService.logException(err);
    }
  }

  @action clearSSOStocks() {
    this.SSOStocks = [];
  }

  @action clear() {
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
  roleTypeId: number;
  leanTecSerialNo?: string;
  accessProfile?: string;
  firmwareVersion?: number;
  controllerSerialNo?: string;
  controllerType?: 'ML' | 'SouthCo' | string;
  // roleTypeDescription: string;
  // dateAssigned: string;
}

export type StockModelWithMLAccess = {
  equipment: StockModel;
  mlAccessData: {
    accessProfile: string;
    firmwareVersion: number;
    masterLockId: string;
  } | null;
};

export type ExtendedStockModel = StockModel &
  Partial<StockModelWithMLAccess['mlAccessData']>;

export type FacilityProductModel = FacilityProductResponse;
export type CategoryModel = CategoryResponse;
export type SupplierModel = SupplierResponse;
