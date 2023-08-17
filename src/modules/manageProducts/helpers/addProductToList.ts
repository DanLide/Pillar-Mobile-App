import {
  always,
  append,
  equals,
  findIndex,
  ifElse,
  lensPath,
  set,
  whereEq,
} from 'ramda';

import { ProductModel } from '../../../stores/types';

export const addProductToList = (
  product: ProductModel,
  list: ProductModel[],
) => {
  const { productId, reservedCount } = product;

  const productIndex = findIndex(whereEq({ productId }), list);

  return ifElse<[ProductModel[]], ProductModel[], ProductModel[]>(
    always(equals(productIndex, -1)),
    append(product),
    set(lensPath([productIndex, 'reservedCount']), reservedCount),
  )(list);
};
