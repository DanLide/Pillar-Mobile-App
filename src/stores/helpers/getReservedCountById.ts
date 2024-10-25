import { filter, map, pipe, propEq, sum } from 'ramda';

import { ProductModel } from '../types';

export const getReservedCountById = (
  products: ProductModel[],
  productId: number,
): number =>
  pipe<[ProductModel[]], ProductModel[], number[], number>(
    filter(propEq('productId', productId)),
    map(product => product.reservedCount ?? 0),
    sum,
  )(products);
