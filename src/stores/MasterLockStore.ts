import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import MasterLockModule, {
  LockVisibility,
  LockStatus,
  MasterLockStateListener,
} from '../data/masterlock';
import { StockModel } from '../modules/stocksList/stores/StocksStore';

type UpdatedLockItem = [string, LockVisibility | LockStatus];

type StockState = {
  visibility: LockVisibility;
  status: LockStatus;
};

const LICENSE_ID = 'fP+bb+lYgrd/mzTcL9MZVTQFd/DmmhZ83ALDnTUgBUJsVQqRdggz1SlNdBu4Ys2tRZei58CeTZSFUgQS7cK8p0hWDfmIVsl29ABil+7phl9CHbvNTxoJ3iVkMx1PIdmWyVRQtWeEuQMWuJzwXkimPVqCJUn66W0hQgBgHdmrp0didJ5aiQ9e6qbkzWJYM9s+I1ma0FmlbIg7erASsR0iUVQ5z4cZbuXPEZcV6hMBXO1iTddkGEL6hJP4M+9oTXm0f5GT1YF3PJP4OS/1HZKX3E4KFBJyCu8QFeY7pTxegqY3FLZJ8V3k/hiEq2edQVaHlji5phJGtOtpPFN3JknIyw==|L67pcPIJEjjcdiWkEJcKOq5icr5Pb/mccQiIsF4cVALIeuxEE93TJ5NhdY4kOvVM3P4XUOoQtIkkRa2hLD0PBSjXs0PMre5klIF5yrnqXD/tly6Sv9GWajTCqzVx2IGK14I/SpQv6c7EEW/AOGyM5P9zJRlMTSdVBAPoJwj9/U0P5bsC1ZSNz3xFNV++eO56qa47stCI3lpQKOk/1Bsj99pcH6BWn2JkeD0Kq8EqSt8nsmxQ112Z92K8Q8HzCWEam727XzHdMT+dDUclvbCPgvBK42ebItYXNYMnF3qHU0+J6NKgeO4okAj6mSESRkdEC5ght7KUt3i1nB6dcYI60A==|dfnCwsY9B4sZ9k1Iio0WQb/XQSE4w9+tcOijf7+1o7Epgf0XfQT9nJH/ZXwQAUffQ6S9hLD7vCYPCuj5KShJyqNSWJTs7LuZIBFbo0TNt02/S2+Wd6q9k6hxtOCEfPfW2wqp/ptSdpKuu/ZR8+Up1BwEY56P9Xj+v9fIn6kg/1E+TqY+CvJhrp7JEMfdihuNpcUC95ltbJoMw96D3X6xmmDn+ClBABDa1q4TLkUY9NLVdUhJ9lxpYLies1dik2xWGo9sJlf3olIyV5Ng9uhMZUm0EAlYxrTLYcfs9p+jX+wv6d+vEFKVuE/FFvIrOn36EQ6XRVhfemQ03zrzwlRs3g=='
class MasterLockStore {
  @observable stocksState: Record<string, StockState>;
  @observable isUnlocking: boolean;

  static parseString(input: string) {
    return input.split('/');
  }

  constructor() {
    makeAutoObservable(this);
    this.stocksState = {};
    this.isUnlocking = false;
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

    MasterLockModule.configure(LICENSE_ID);
  }

  @action initMasterLockForStocks(stockItem: StockModel): Promise<string> {
    return MasterLockModule.initLock(
      stockItem.deviceId,
      stockItem.accessProfile,
      stockItem.firmwareVersion,
    );
  }

  @action unlock(deviceID: string) {
    this.isUnlocking = true;
    MasterLockModule.unlock(deviceID).then(() => {
      runInAction(() => {
        this.isUnlocking = false;
      });
    });
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

export default new MasterLockStore();
