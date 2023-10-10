import {
  always,
  append,
  assocPath,
  equals,
  findIndex,
  ifElse,
  pathOr,
  whereEq,
} from 'ramda';

import { ProductModel } from '../types';

const reservedCountPath = (productIndex: number) => [
  productIndex,
  'reservedCount',
];

export const addProductByJob = (
  product: ProductModel,
  list: ProductModel[],
) => {
  const { productId, job, reservedCount = 0 } = product;

  const productIndex = findIndex(whereEq({ productId, job }), list);

  return ifElse<[ProductModel[]], ProductModel[], ProductModel[]>(
    always(equals(productIndex, -1)),
    append(product),
    assocPath(
      reservedCountPath(productIndex),
      reservedCount + pathOr(0, reservedCountPath(productIndex), list),
    ),
  )(list);
};
