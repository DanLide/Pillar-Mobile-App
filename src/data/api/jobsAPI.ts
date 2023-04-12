import { URLProvider, tryAuthFetch } from '../helpers';

export interface JobModel {
  jobId: number;
  jobNumber: string;
}

export const getFetchJobsAPI = () => {
  const url = new URLProvider().getFetchJobsBySso();

  return tryAuthFetch<JobModel[]>({ url, request: { method: 'GET' } });
};
