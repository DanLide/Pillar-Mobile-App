import { action, makeObservable, observable } from 'mobx';
import { JobModel } from '../../../data/api/jobsAPI';

export class JobsStore {
  @observable jobs: JobModel[];

  constructor() {
    this.jobs = [];

    makeObservable(this);
  }

  @action setJobs(jobs: JobModel[]) {
    this.jobs = jobs;
  }

  public clear() {
    this.jobs = [];
  }
}