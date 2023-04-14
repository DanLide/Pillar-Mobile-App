import { Task, TaskExecutor } from './helpers';
import { getFetchJobsAPI } from './api';

import { JobsStore } from '../modules/jobsList/stores';
import { JobResponseModel } from './api/jobsAPI';

interface FetchJobsContext {
  jobs?: JobResponseModel[];
}

export const fetchJobs = async (jobsStore: JobsStore) => {
  const fetchJobsContext: FetchJobsContext = {
    jobs: [],
  };
  const result = await new TaskExecutor([
    new FetchJobsTask(fetchJobsContext),
    new SaveJobsToStoreTask(fetchJobsContext, jobsStore),
  ]).execute();

  return result;
};

class FetchJobsTask extends Task {
  fetchJobsContext: FetchJobsContext;

  constructor(fetchJobsContext: FetchJobsContext) {
    super();
    this.fetchJobsContext = fetchJobsContext;
  }

  async run(): Promise<void> {
    const response = await getFetchJobsAPI();
    this.fetchJobsContext.jobs = response;
  }
}

class SaveJobsToStoreTask extends Task {
  fetchJobsContext: FetchJobsContext;
  jobsStore: JobsStore;

  constructor(fetchJobsContext: FetchJobsContext, jobsStore: JobsStore) {
    super();
    this.fetchJobsContext = fetchJobsContext;
    this.jobsStore = jobsStore;
  }

  async run(): Promise<void> {
    if (this.fetchJobsContext.jobs) {
      this.jobsStore.setJobs(this.fetchJobsContext.jobs);
    }
  }
}
