import { ExtendedStockModel } from './../modules/stocksList/stores/StocksStore';
import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import MasterLockModule, {
  LockVisibility,
  LockStatus,
  MasterLockStateListener,
} from '../data/masterlock';
import { PermissionStore } from 'src/modules/permissions/stores/PermissionStore';
import { RESULTS } from 'react-native-permissions';
import { RoleType } from 'src/constants/common.enum';

type UpdatedLockItem = [string, LockVisibility | LockStatus];

type StockState = {
  visibility: LockVisibility;
  status: LockStatus;
};

const LICENSE_ID =
  'fP+bb+lYgrd/mzTcL9MZVTQFd/DmmhZ83ALDnTUgBUJsVQqRdggz1SlNdBu4Ys2tRZei58CeTZSFUgQS7cK8p0hWDfmIVsl29ABil+7phl9CHbvNTxoJ3iVkMx1PIdmWyVRQtWeEuQMWuJzwXkimPVqCJUn66W0hQgBgHdmrp0didJ5aiQ9e6qbkzWJYM9s+I1ma0FmlbIg7erASsR0iUVQ5z4cZbuXPEZcV6hMBXO1iTddkGEL6hJP4M+9oTXm0f5GT1YF3PJP4OS/1HZKX3E4KFBJyCu8QFeY7pTxegqY3FLZJ8V3k/hiEq2edQVaHlji5phJGtOtpPFN3JknIyw==|L67pcPIJEjjcdiWkEJcKOq5icr5Pb/mccQiIsF4cVALIeuxEE93TJ5NhdY4kOvVM3P4XUOoQtIkkRa2hLD0PBSjXs0PMre5klIF5yrnqXD/tly6Sv9GWajTCqzVx2IGK14I/SpQv6c7EEW/AOGyM5P9zJRlMTSdVBAPoJwj9/U0P5bsC1ZSNz3xFNV++eO56qa47stCI3lpQKOk/1Bsj99pcH6BWn2JkeD0Kq8EqSt8nsmxQ112Z92K8Q8HzCWEam727XzHdMT+dDUclvbCPgvBK42ebItYXNYMnF3qHU0+J6NKgeO4okAj6mSESRkdEC5ght7KUt3i1nB6dcYI60A==|dfnCwsY9B4sZ9k1Iio0WQb/XQSE4w9+tcOijf7+1o7Epgf0XfQT9nJH/ZXwQAUffQ6S9hLD7vCYPCuj5KShJyqNSWJTs7LuZIBFbo0TNt02/S2+Wd6q9k6hxtOCEfPfW2wqp/ptSdpKuu/ZR8+Up1BwEY56P9Xj+v9fIn6kg/1E+TqY+CvJhrp7JEMfdihuNpcUC95ltbJoMw96D3X6xmmDn+ClBABDa1q4TLkUY9NLVdUhJ9lxpYLies1dik2xWGo9sJlf3olIyV5Ng9uhMZUm0EAlYxrTLYcfs9p+jX+wv6d+vEFKVuE/FFvIrOn36EQ6XRVhfemQ03zrzwlRs3g==';

export const RELOCK_TIME = 10000; // msec
export const RELOCK_TIME_SEC = RELOCK_TIME / 1000;
export const INIT_TIME = 4000;

export class MasterLockStore {
  @observable stocksState: Record<string, StockState>;
  @observable isUnlocking: boolean;
  @observable relockTimeMasterlocksTime: Record<string, string>;
  @observable permissionStore: PermissionStore;
  @observable masterlockConfigured: boolean;
  @observable isIniting: boolean;

  static parseString(input: string) {
    return input.split('/');
  }

  constructor(permissionStoreInstance: PermissionStore) {
    makeAutoObservable(this);
    this.stocksState = {};
    this.relockTimeMasterlocksTime = {};
    this.isUnlocking = false;
    this.permissionStore = permissionStoreInstance;
    this.masterlockConfigured = false;
    this.isIniting = false;

    MasterLockStateListener.addListener('visibilityStatus', (data: string) => {
      const updatedVisibility = MasterLockStore.parseString(
        data,
      ) as UpdatedLockItem;
      this.updateStockState(updatedVisibility, 'visibility');
    });

    MasterLockStateListener.addListener('lockStatus', (data: string) => {
      const updatedStatuses = MasterLockStore.parseString(
        data,
      ) as UpdatedLockItem;
      this.updateStockState(updatedStatuses, 'status');
    });
  }

  @action async initMasterLockForStocks(stocks: ExtendedStockModel[]) {
    if (this.isIniting) return;
    this.isIniting = true;
    await MasterLockModule.configure(LICENSE_ID);
    const stocksWithML = stocks.filter(
      stock =>
        stock.roleTypeId === RoleType.Cabinet &&
        stock.controllerSerialNo &&
        stock.accessProfile &&
        stock.firmwareVersion,
    );
    for (const stock of stocksWithML) {
      const { controllerSerialNo, accessProfile, firmwareVersion } = stock;

      if (
        stock.roleTypeId === RoleType.Cabinet &&
        controllerSerialNo &&
        accessProfile &&
        firmwareVersion
      ) {
        await MasterLockModule.initLock(
          controllerSerialNo,
          accessProfile,
          firmwareVersion,
        );
      }
      setTimeout(() => {
        this.isIniting = false;
      }, INIT_TIME);
    }
  }

  @action async unlock(deviceID: string) {
    this.isUnlocking = true;
    await this.handleMasterRelockTime(deviceID);
    MasterLockModule.unlock(deviceID).then(() => {
      runInAction(() => {
        this.isUnlocking = false;
      });
    });
  }

  @action async handleMasterRelockTime(deviceId: string) {
    try {
      if (this.relockTimeMasterlocksTime[deviceId] !== RELOCK_TIME_SEC + '') {
        const time = await MasterLockModule.readRelockTime(deviceId);
        if (time !== RELOCK_TIME_SEC + '') {
          await MasterLockModule.writeRelockTime(deviceId, RELOCK_TIME_SEC);
          runInAction(() => {
            this.relockTimeMasterlocksTime = {
              ...this.relockTimeMasterlocksTime,
              [deviceId]: RELOCK_TIME_SEC + '',
            };
          });
          return;
        }
      }
    } catch (e) {
      console.warn('error', e);
    }
  }

  @action updateStockState(
    updatedItem: UpdatedLockItem,
    statusKey: keyof StockState,
  ) {
    const [id, value] = updatedItem;

    this.stocksState = {
      ...this.stocksState,
      [id]: {
        ...this.stocksState[id],
        [statusKey]: value,
      },
    };
  }
}
