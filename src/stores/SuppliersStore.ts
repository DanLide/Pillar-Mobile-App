import { action, makeObservable, observable } from 'mobx';
import { SupplierResponse } from '../data/api/productsAPI';

export type SupplierModel = SupplierResponse;
export class SuppliersStore {
  @observable suppliers: SupplierModel[];
  @observable enabledSuppliers: SupplierModel[];

  constructor() {
    this.suppliers = [];
    this.enabledSuppliers = [];

    makeObservable(this);
  }

  @action setSuppliers(suppliers: SupplierModel[]) {
    this.suppliers = suppliers;
  }

  @action setEnabledSuppliers(enabledSuppliers: SupplierModel[]) {
    this.enabledSuppliers = enabledSuppliers;
  }

  public clear() {
    this.suppliers = [];
  }
}
