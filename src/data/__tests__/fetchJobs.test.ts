import { fetchJobs, FetchJobsTask, SaveJobsToStoreTask } from '../fetchJobs';

import { getFetchJobsAPI, JobResponse } from '../api/jobsAPI';
import { JobsStore } from '../../modules/jobsList/stores';

jest.mock('../api/jobsAPI');

const mockJobs: JobResponse[] = [
  {
    jobId: 1,
    jobNumber: '132',
    status: 'OPEN',
  },
];

const mockSetJob = jest.fn();

const jobStore: JobsStore = {
  jobs: [],
  setJobs: mockSetJob,
  clear: jest.fn(),
};

describe('fetchJobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute FetchJobsTask task', async () => {
    (getFetchJobsAPI as jest.Mock).mockReturnValue(mockJobs);
    const fetchJobsTask = new FetchJobsTask({});
    await expect(fetchJobsTask.run()).resolves.not.toThrow();
    expect(fetchJobsTask.fetchJobsContext.jobs).toBe(mockJobs);
    expect(getFetchJobsAPI).toHaveBeenCalled();
  });

  it('should throw Error FetchJobsTask task', async () => {
    (getFetchJobsAPI as jest.Mock).mockImplementation(() => {
      throw Error();
    });
    const fetchJobsTask = new FetchJobsTask({});
    await expect(fetchJobsTask.run()).rejects.toThrow();
    expect(getFetchJobsAPI).toHaveBeenCalled();
  });

  it('should execute SaveJobsToStoreTask task', () => {
    const saveJobsToStoreTask = new SaveJobsToStoreTask(
      { jobs: mockJobs },
      jobStore,
    );
    expect(saveJobsToStoreTask.run()).resolves.not.toThrow();
    expect(mockSetJob).toHaveBeenCalledWith([
      {
        jobId: 1,
        jobNumber: '132',
        jobDescription: undefined,
      },
    ]);
  });

  it('should execute SaveJobsToStoreTask task with empty jobs context', () => {
    const saveJobsToStoreTask = new SaveJobsToStoreTask(
      { jobs: undefined },
      jobStore,
    );
    expect(saveJobsToStoreTask.run()).resolves.not.toThrow();
    expect(mockSetJob).not.toHaveBeenCalled();
  });

  it('should call fetchJobs with empty jobs in jobStore', async () => {
    await fetchJobs(jobStore);
    expect(getFetchJobsAPI).toHaveBeenCalled();
  });
});
