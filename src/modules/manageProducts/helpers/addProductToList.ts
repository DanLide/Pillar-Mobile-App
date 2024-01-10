import {
  always,
  append,
  equals,
  findIndex,
  ifElse,
  update,
  whereEq,
} from 'ramda';

import { ProductModel } from 'src/stores/types';

export const addProductToList = (
  product: ProductModel,
  list: ProductModel[],
) => {
  const { productId } = product;

  const productIndex = findIndex(whereEq({ productId }), list);

  return ifElse<[ProductModel[]], ProductModel[], ProductModel[]>(
    always(equals(productIndex, -1)),
    append(product),
    update(productIndex, product),
  )(list);
};
