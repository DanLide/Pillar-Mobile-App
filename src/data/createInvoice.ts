import { Task } from './helpers';
import { createInvoiceAPI } from './api';
import { CreateInvoiceStore } from '../modules/createInvoice/stores';
import { clone } from 'ramda';
import { ProductModel } from '../stores/types';
import { CreateInvoiceRequestBody } from './api/createInvoiceAPI';
import { JobModel } from '../modules/jobsList/stores/JobsStore';

export const onCreateInvoice = async (
  createInvoiceStore: CreateInvoiceStore,
) => {
  try {
    await new CreateInvoiceTask(createInvoiceStore).run();
  } catch (error) {
    return error;
  }
};

class CreateInvoiceTask extends Task {
  createInvoiceStore: CreateInvoiceStore;
  constructor(createInvoiceStore: CreateInvoiceStore) {
    super();
    this.createInvoiceStore = createInvoiceStore;
  }
  async run() {
    const job = this.createInvoiceStore.currentJob;
    if (job) {
      const products = clone(this.createInvoiceStore.getProducts);
      const invoiceJobs = products.map((product: ProductModel) =>
        this.mapProductsWithJob(product, job),
      );
      await createInvoiceAPI(invoiceJobs);
      const syncedProducts = products.map((product: ProductModel) => ({
        ...product,
        isRemoved: true,
      }));
      this.createInvoiceStore.setProducts(syncedProducts);
    }
  }

  private mapProductsWithJob(
    product: ProductModel,
    job: JobModel,
  ): CreateInvoiceRequestBody {
    return {
      ...product,
      jobID: job.jobId,
      jobNumber: job.jobNumber,
      qty: product.reservedCount,
    };
  }
}
