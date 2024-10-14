import { Task, TaskExecutor } from './helpers/taskExecutor';

import { deviceInfoStore, ssoStore } from '../stores';
import { resetMasterlockAPI } from './api/stocksAPI';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';

export const resetMasterlock = async (selectedStocks: StockModel[]) => {
  const result = await new TaskExecutor([
    new ResetMasterlockTask(selectedStocks),
  ]).execute();

  return result;
};

export class ResetMasterlockTask extends Task {
  selectedStocks: StockModel[];
  constructor(selectedStocks: StockModel[]) {
    super();
    this.selectedStocks = selectedStocks;
  }

  async run(): Promise<void> {
    const deviceId = ssoStore.getCurrentMobileDevice(
      deviceInfoStore.getDeviceName,
    )?.partyRoleId;
    const ssoId = ssoStore.getCurrentSSO?.pisaId;
    if (deviceId && ssoId) {
      const body = {
        storage: this.mapSelectedStocksToStorage(this.selectedStocks),
        device: [{ id: deviceId }],
        repairFacilityId: `${ssoId}`,
      };
      await resetMasterlockAPI(body);
    }
  }

  mapSelectedStocksToStorage(selectedStocks: StockModel[]) {
    return selectedStocks.reduce<
      Array<{ deviceIdentifier: string; id: number }>
    >((acc, stock) => {
      if (stock.controllerSerialNo) {
        acc.push({
          deviceIdentifier: stock.controllerSerialNo,
          id: stock.partyRoleId,
        });
      }
      return acc;
    }, []);
  }
}
