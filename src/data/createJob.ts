import { Task, TaskExecutor } from './helpers';
import { createJobAPI, checkIsExistJobAPI } from './api';
import { ssoStore } from 'src/stores';

export const onCreateJob = async (jobNumber: string, description: string) => {
  const result = await new TaskExecutor([
    new CreateJobTask(jobNumber, description),
  ]).execute();

  return result;
};

class CreateJobTask extends Task {
  jobNumber: string;
  description: string;
  constructor(jobNumber: string, description: string) {
    super();
    this.jobNumber = jobNumber;
    this.description = description;
  }
  async run() {
    await createJobAPI(
      this.jobNumber,
      this.description,
      ssoStore.getCurrentSSO?.pisaId,
    );
  }
}

export const checkIsExistJob = async (jobNumber: string) => {
  const result = {
    isExist: false,
  };
  await new TaskExecutor([
    new CheckIsExistJobTask(result, jobNumber),
  ]).execute();
  return result.isExist;
};

class CheckIsExistJobTask extends Task {
  result: { isExist: boolean };
  jobNumber: string;
  constructor(result: { isExist: boolean }, jobNumber: string) {
    super();
    this.jobNumber = jobNumber;
    this.result = result;
  }
  async run() {
    const result = await checkIsExistJobAPI(this.jobNumber);
    if (result !== 'NOTEXISTS') {
      this.result.isExist = true;
    }
  }
}
