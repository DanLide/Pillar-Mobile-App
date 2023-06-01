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

import { RemoveProductModel } from '../stores/RemoveProductsStore';

export const addProductToList = (
  product: RemoveProductModel,
  list: RemoveProductModel[],
) => {
  const { productId, job, reservedCount } = product;

  const productIndex = findIndex(whereEq({ productId, job }), list);

  return ifElse<
    [RemoveProductModel[]],
    RemoveProductModel[],
    RemoveProductModel[]
  >(
    always(equals(productIndex, -1)),
    append(product),
    over(lensPath([productIndex, 'reservedCount']), add(reservedCount)),
  )(list);
};
