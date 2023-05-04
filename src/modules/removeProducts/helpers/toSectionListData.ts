import { pipe, groupBy, mapObjIndexed, propOr, values } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';

function toSectionListDataLike<T>(value: T[], key: string) {
  return {
    data: value,
    title: key,
  };
}

export const toSectionListData = (data: RemoveProductModel[]) =>
  pipe(
    groupBy(propOr('-1', 'jobId')),
    mapObjIndexed(toSectionListDataLike),
    values,
  )(data);
