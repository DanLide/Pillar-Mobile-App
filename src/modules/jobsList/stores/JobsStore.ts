import { action, makeObservable, observable } from 'mobx';
import { JobResponseModel } from '../../../data/api/jobsAPI';

export class JobsStore {
  @observable jobs: JobResponseModel[];

  constructor() {
    this.jobs = [];

    makeObservable(this);
  }

  @action setJobs(jobs: JobResponseModel[]) {
    this.jobs = jobs;
  }

  public clear() {
    this.jobs = [];
  }
}