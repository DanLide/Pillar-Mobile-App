import { either, filter, isEmpty, isNil, map, not, pipe } from 'ramda';

export class Utils {
  static zeroToUndefined<Type>(value: Type) {
    return value == '0' ? undefined : value;
  }

  static isEmpty(value: string | undefined) {
    return value === undefined || value == null || value.trim().length === 0;
  }

  static notNullOrEmpty<Type>(value: Type) {
    return pipe(either(isNil, isEmpty), not)(value);
  }

  static numbersToBigInts(collection: Array<number | undefined>) {
    return pipe(filter(this.notNullOrEmpty), map(BigInt))(collection);
  }
}
