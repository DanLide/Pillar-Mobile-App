import { Task } from './helpers';
import { createInvoiceAPI } from './api';
import { CreateInvoiceStore } from '../modules/createInvoice/stores';
import { clone } from 'ramda';
import { ProductModel } from '../stores/types';
import { CreateInvoiceRequestBody } from './api/createInvoiceAPI';
import { JobModel } from '../modules/jobsList/stores/JobsStore';

// TODO https://dev.azure.com/3M-Bluebird/Pillar/_workitems/edit/113299
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
      product: product.productId.toString(),
      inventoryAssignmentId: 0, // todo
      productId: product.productId,
      manufactureCode: product.manufactureCode,
      partNo: product.partNo,
      size: product.size,
      name: product.name,
      jobPrice: 0, // todo
      supplierPartyRoleId: 0, // todo
      supplier: 'string', // todo
      onHand: 0, // todo
      extCost: 0, // todo
      extPrice: 0, // todo
      unitCost: 0, // todo
      isTaxable: 0, // todo
      isRecoverable: 'No',
      jobID: job.jobId,
      jobNumber: job.jobNumber,
      qty: product.reservedCount,
      jobDetailID: 0, // todo
      type: 'string', // todo
      description: product.name,
      inventoryTransactionID: 0, // todo
      tax: 0, // todo
      status: 'string', // todo
    };
  }
}
