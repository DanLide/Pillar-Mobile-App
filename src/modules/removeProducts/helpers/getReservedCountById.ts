import { filter, map, pipe, propEq, sum } from 'ramda';

import { RemoveProductModel } from '../stores/RemoveProductsStore';
import { Utils } from '../../../data/helpers/utils';

export const getReservedCountById = (
  products: RemoveProductModel[],
  productId: number,
): number =>
  pipe<
    [RemoveProductModel[]],
    RemoveProductModel[],
    string[],
    number[],
    number
  >(
    filter(propEq('productId', productId)),
    map(product => product.reservedCount),
    Utils.stringsToNumbers,
    sum,
  )(products);
