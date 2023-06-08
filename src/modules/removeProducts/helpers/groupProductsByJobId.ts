import { pipe, groupBy, mapObjIndexed, pathOr, values } from 'ramda';

import { ProductModel } from '../../../stores/types';

import { OTHER_JOB_ID } from '../constants';

export const groupProductsByJobId = (data: ProductModel[]) =>
  pipe(
    groupBy<ProductModel, string>(pathOr(OTHER_JOB_ID, ['job', 'jobId'])),
    mapObjIndexed((products: ProductModel[], jobId: string) => ({
      data: products,
      jobId: jobId === OTHER_JOB_ID ? jobId : products[0].job?.jobNumber,
    })),
    values,
  )(data);
