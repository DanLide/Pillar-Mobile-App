import { URLProvider, tryAuthFetch } from '../helpers';

export interface JobResponse {
  jobId: number;
  jobNumber: string;
  status: 'OPEN' | 'CLOSE';
}

export const getFetchJobsAPI = () => {
  const url = new URLProvider().getFetchJobsBySso();

  return tryAuthFetch<JobResponse[]>({ url, request: { method: 'GET' } });
};
