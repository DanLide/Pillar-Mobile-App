import { map, pipe, sum } from 'ramda';

import { ProductModel } from 'src/stores/types';

export const getProductsReservedCount = pipe<
  [ProductModel[]],
  number[],
  number
>(
  map(product => product.reservedCount ?? 0),
  sum,
);
