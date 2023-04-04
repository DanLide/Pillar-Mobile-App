import { either, filter, isEmpty, isNil, map, not, pipe } from 'ramda';

export class Utils {
  static zeroToUndefined<Type>(value: Type) {
    return value == '0' ? undefined : value;
  }

  static isNullOrEmpty<Type>(value: Type) {
    return either(isNil, isEmpty)(value);
  }

  static notNullOrEmpty<Type>(value: Type) {
    return pipe(this.isNullOrEmpty, not)(value);
  }

  static numbersToBigInts(collection: Array<number | undefined>) {
    return pipe(filter(this.notNullOrEmpty), map(BigInt))(collection);
  }
}
