import { ProductModel } from '../../../stores/types';
import { complement, equals, find, not, pipe, where } from 'ramda';

export const getIsUpcUnique = (product?: ProductModel) =>
  pipe(
    find(
      where({
        upc: equals(product?.upc),
        productId: complement(equals(product?.productId)),
      }),
    ),
    not,
  );
