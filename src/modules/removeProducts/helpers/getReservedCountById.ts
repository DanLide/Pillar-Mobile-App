import { filter, pipe, pluck, propEq, sum } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';

export const getReservedCountById = (
  products: RemoveProductModel[],
  productId: number,
): number =>
  pipe<[RemoveProductModel[]], RemoveProductModel[], number[], number>(
    filter(propEq('productId', productId)),
    pluck('reservedCount'),
    sum,
  )(products);
