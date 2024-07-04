import { Task, TaskExecutor } from './helpers';
import { getFetchJobsByProductAPI } from './api';

import { JobResponse } from './api/jobsAPI';

import { CurrentProductStoreType, ProductModel } from '../stores/types';

interface FetchJobsByProductContext {
  jobs?: JobResponse[];
}

export const fetchJobsByProduct = async (
  store: CurrentProductStoreType,
  product: ProductModel,
) => {
  const jobsContext: FetchJobsByProductContext = {
    jobs: undefined,
  };
  const result = await new TaskExecutor([
    new FetchJobsByProductTask(jobsContext, product, store),
    new SaveJobsByProductToStoreTask(jobsContext, product, store),
  ]).execute();

  return result;
};

export class FetchJobsByProductTask extends Task {
  jobsContext: FetchJobsByProductContext;
  product: ProductModel;
  store?: CurrentProductStoreType;

  constructor(
    jobsContext: FetchJobsByProductContext,
    product: ProductModel,
    store?: CurrentProductStoreType,
  ) {
    super();
    this.jobsContext = jobsContext;
    this.store = store;
    this.product = product;
  }

  async run(): Promise<void> {
    this.jobsContext.jobs = await getFetchJobsByProductAPI(
      this.product.productId,
      this.product.partyRoleId,
    );
  }
}

export class SaveJobsByProductToStoreTask extends Task {
  jobsContext: FetchJobsByProductContext;
  product: ProductModel;
  currentProductStore: CurrentProductStoreType;

  constructor(
    jobsContext: FetchJobsByProductContext,
    product: ProductModel,
    currentProductStore: CurrentProductStoreType,
  ) {
    super();
    this.jobsContext = jobsContext;
    this.currentProductStore = currentProductStore;
    this.product = product;
  }

  async run(): Promise<void> {
    const { jobs } = this.jobsContext;

    this.currentProductStore.setProductJobs(this.product.productId, jobs || []);
  }
}
