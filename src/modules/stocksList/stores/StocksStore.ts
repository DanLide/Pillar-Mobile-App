export class StockStore {
  private stocks: Stock[];

  constructor() {
    this.stocks = [];
  }

  public get getStocks() {
    return this.stocks;
  }

  public setStocks(stocks: Stock[]) {
    this.stocks = stocks.sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName),
    );
  }

  public clear() {
    this.stocks = [];
  }
}

export interface Stock {
  partyRoleId: number;
  roleTypeId: number;
  roleTypeDescription: string;
  dateAssigned: string;
  organizationName: string;
  isRelationshipExists: string;
  organizationPartyRoleId: number;
  isAssignedSupplyArea: number;
  serialPartyRoleId: number;
  onHand: number;
  onOrder: number;
  isActiveTransfer: number;
  isAssignedToUser: number;
}
