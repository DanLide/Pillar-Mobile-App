import { URLProvider, tryAuthFetch } from '../helpers';

export interface JobResponseModel {
  jobId: number;
  jobNumber: string;
}

export const getFetchJobsAPI = () => {
  const url = new URLProvider().getFetchJobsBySso();

  return tryAuthFetch<JobResponseModel[]>({ url, request: { method: 'GET' } });
};
