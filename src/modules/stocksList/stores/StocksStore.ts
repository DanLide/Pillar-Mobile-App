import { action, makeObservable, observable } from 'mobx';

export class StockStore {
  @observable stocks: StockModel[];

  constructor() {
    this.stocks = [];

    makeObservable(this);
  }

  @action setStocks(stocks: StockModel[]) {
    this.stocks = stocks.sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName),
    );
  }

  public clear() {
    this.stocks = [];
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
  // partyRoleId: number;
  // roleTypeId: number;
  // roleTypeDescription: string;
  // dateAssigned: string;
}
