import { pipe, groupBy, mapObjIndexed, pathOr, values } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';
import { OTHER_JOB_ID } from '../constants';

export const groupProductsByJobId = (data: RemoveProductModel[]) =>
  pipe(
    groupBy<RemoveProductModel, string>(pathOr(OTHER_JOB_ID, ['job', 'jobId'])),
    mapObjIndexed((products: RemoveProductModel[], jobId: string) => ({
      data: products,
      jobId: jobId === OTHER_JOB_ID ? jobId : products[0].job?.jobNumber,
    })),
    values,
  )(data);
