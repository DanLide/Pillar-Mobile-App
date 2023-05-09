import { Task, TaskExecutor } from './helpers';
import { getFetchJobsAPI } from './api';

import { JobsStore } from '../modules/jobsList/stores';
import { JobResponse } from './api/jobsAPI';
import { JobModel } from '../modules/jobsList/stores/JobsStore';

interface FetchJobsContext {
  jobs?: JobResponse[];
}

export const fetchJobs = async (jobsStore: JobsStore) => {
  const fetchJobsContext: FetchJobsContext = {
    jobs: [],
  };
  if (!jobsStore.jobs.length) {
    const result = await new TaskExecutor([
      new FetchJobsTask(fetchJobsContext),
      new SaveJobsToStoreTask(fetchJobsContext, jobsStore),
    ]).execute();

    return result;
  }
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
      this.jobsStore.setJobs(this.mapJobResponse(this.fetchJobsContext.jobs));
    }
  }

  private mapJobResponse(jobs: JobResponse[]): JobModel[] {
    return jobs.map(job => ({
      jobId: job.jobId,
      jobNumber: job.jobNumber,
      jobDescription: job.jobDescription,
    }));
  }
}
