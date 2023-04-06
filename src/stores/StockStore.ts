import { Stock } from '../modules/stocksList/stores/StocksStore';

export class StockStore {
  private currentStock?: Stock;

  constructor() {
    this.currentStock = undefined;
  }

  public get getCurrentStock() {
    return this.currentStock;
  }

  public setCurrentStocks(stock: Stock) {
    this.currentStock = stock;
  }

  public clear() {
    this.currentStock = undefined;
  }
}
