import { pipe, groupBy, mapObjIndexed, propOr, values } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';
import { OTHER_JOB_ID } from '../constants';

function productsGroupType<T>(products: T[], jobID: string) {
  return {
    data: products,
    title: jobID,
  };
}

export const groupProductsByJob = (data: RemoveProductModel[]) =>
  pipe(
    groupBy(propOr(OTHER_JOB_ID, 'jobId')),
    mapObjIndexed(productsGroupType),
    values,
  )(data);
