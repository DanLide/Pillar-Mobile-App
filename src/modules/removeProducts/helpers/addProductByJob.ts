import {
  add,
  always,
  append,
  equals,
  findIndex,
  ifElse,
  lensPath,
  over,
  whereEq,
} from 'ramda';
import { ProductModel } from '../../../stores/types';

export const addProductByJob = (
  product: ProductModel,
  list: ProductModel[],
) => {
  const { productId, job, reservedCount } = product;

  const productIndex = findIndex(whereEq({ productId, job }), list);

  return ifElse<[ProductModel[]], ProductModel[], ProductModel[]>(
    always(equals(productIndex, -1)),
    append(product),
    over(lensPath([productIndex, 'reservedCount']), add(reservedCount)),
  )(list);
};
