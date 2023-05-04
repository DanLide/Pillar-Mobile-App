import { pipe, groupBy, mapObjIndexed, propOr, values } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';
import { OTHER_JOB_ID } from '../constants';

export const groupProductsByJobId = (data: RemoveProductModel[]) =>
  pipe(
    groupBy<RemoveProductModel, string>(propOr(OTHER_JOB_ID, 'jobId')),
    mapObjIndexed((products: RemoveProductModel[], jobId: string) => {
      return {
        data: products,
        jobId,
      };
    }),
    values,
  )(data);
