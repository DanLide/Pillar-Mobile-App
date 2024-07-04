import { action, makeObservable, observable, computed } from 'mobx';
import i18n from 'i18next';
export interface JobModel {
  jobId: number;
  jobNumber: string;
  jobDescription?: string;
  extCost?: number;
  extPrice?: number;
  inventoryAssignmentId?: number;
  isRecoverable?: string;
  isTaxable?: number;
  jobDetailId?: number;
  onHand?: number;
  productID?: number;
  qty?: number;
  status?: string;
  tax?: number;
  unitCost?: number;
}

export const jobIdNoRepairOrder = 0;

export class JobsStore {
  @observable jobs: JobModel[];

  constructor() {
    this.jobs = [];

    makeObservable(this);
  }

  @action setJobs(jobs: JobModel[]) {
    this.jobs = jobs;
  }

  @computed get getJobsWithNoRepairOrder() {
    const jobNoRepairOrder: JobModel = {
      jobId: jobIdNoRepairOrder,
      jobNumber: i18n.t('noRepairOrder'),
    };

    return [jobNoRepairOrder, ...this.jobs];
  }

  public clear() {
    this.jobs = [];
  }
}
