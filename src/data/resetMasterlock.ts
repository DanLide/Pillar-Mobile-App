import { Task, TaskExecutor } from './helpers/taskExecutor';

import { TokenData } from './login';
import { authStore, ssoStore } from '../stores';
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
    const deviceId = ssoStore.getCurrentMobileDevice()?.partyRoleId;
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
      if (stock.leanTecSerialNo) {
        acc.push({
          deviceIdentifier: stock.leanTecSerialNo,
          id: stock.partyRoleId,
        });
      }
      return acc;
    }, []);
  }
}

export class SaveTokensToStore extends Task {
  refreshTokenContext: TokenData;

  constructor(refreshTokenContext: TokenData) {
    super();
    this.refreshTokenContext = refreshTokenContext;
  }

  async run() {
    const { token, tokenExpiresIn, refreshToken } = this.refreshTokenContext;
    if (token && refreshToken && typeof tokenExpiresIn === 'number') {
      authStore.setToken(token, refreshToken, tokenExpiresIn);
    } else {
      throw Error('Token is not defined!');
    }
  }
}
