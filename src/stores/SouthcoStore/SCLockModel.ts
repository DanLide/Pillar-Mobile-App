import { action, makeObservable, observable } from 'mobx';
import { SCLockStatusEnum } from 'src/libs';

export class SCLockModel {
  id: string;
  @observable
  status: SCLockStatusEnum;
  @observable
  isRegistered: boolean;
  isLockStatusDetermined: boolean | null = null;

  constructor(data: {
    id: string;
    status: SCLockStatusEnum;
    isRegistered: boolean;
  }) {
    makeObservable(this);
    this.id = data.id;
    this.status = data.status;
    this.isRegistered = data.isRegistered;
  }

  @action
  updateStatus(val: SCLockStatusEnum) {
    this.status = val;
  }

  @action
  determinateStatus(val: boolean | null) {
    this.isLockStatusDetermined = val;
  }

  @action
  setIsRegistered(val: boolean) {
    this.isRegistered = val;
  }
}
