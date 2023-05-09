import { action, makeObservable, observable } from 'mobx';

export interface JobModel {
  jobId: number;
  jobNumber: string;
  jobDescription?: string;
}

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
