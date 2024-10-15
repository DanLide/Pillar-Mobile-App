import { element, by } from 'detox';

class SelectStockLocationScreen {
  async selectStockLocation(stockName) {
    const stockLocation = element(by.text(stockName));
    await stockLocation.tap();
  }
}

export default new SelectStockLocationScreen();
