import { either, filter, isEmpty, isNil, map, not, pipe } from 'ramda';

export const notEmpty = pipe(either(isNil, isEmpty), not);
export const numbersToBigInts = pipe(filter(notEmpty), map(BigInt));
