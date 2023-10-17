import { Task, TaskExecutor } from './helpers';
import { createInvoiceAPI } from './api';
import { CreateInvoiceStore } from '../modules/createInvoice/stores';
import { clone } from 'ramda';
import { ProductModel } from '../stores/types';
import { CreateInvoiceRequestBody } from './api/createInvoiceAPI';

export const onCreateInvoice = async (
  createInvoiceStore: CreateInvoiceStore,
) => {
  const result = await new TaskExecutor([
    new CreateInvoiceTask(createInvoiceStore),
  ]).execute();

  return result;
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
        this.mapProductsWithJob(product),
      );
      await createInvoiceAPI(invoiceJobs, job.jobId);
      const syncedProducts = products.map((product: ProductModel) => ({
        ...product,
        isRemoved: true,
      }));
      this.createInvoiceStore.setProducts(syncedProducts);
    }
  }

  private mapProductsWithJob(product: ProductModel): CreateInvoiceRequestBody {
    return {
      productId: product.productId,
      qty: product.reservedCount || 0,
    };
  }
}
