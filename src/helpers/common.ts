import { pipe, groupBy, mapObjIndexed, pathOr, values } from 'ramda';

import { ProductModel } from 'src/stores/types';
import { OTHER_JOB_ID } from 'src/constants';

export const delay = (timeout: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });

export const groupProductsByJobId = (data: ProductModel[]) =>
  pipe(
    groupBy<ProductModel, string>(pathOr(OTHER_JOB_ID, ['job', 'jobId'])),
    mapObjIndexed((products: ProductModel[], jobId: string) => ({
      data: products,
      jobId: jobId === OTHER_JOB_ID ? jobId : products[0].job?.jobNumber,
    })),
    values,
  )(data);
