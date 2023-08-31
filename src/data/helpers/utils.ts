import { either, filter, isEmpty, isNil, map, not, pipe } from 'ramda';
import { BadRequestError, RequestError } from './tryFetch';

export class Utils {
  static zeroToUndefined<Type>(value: Type) {
    return value == '0' ? undefined : value;
  }

  static isNullOrEmpty<Type>(value: Type) {
    return either(isNil, isEmpty)(value);
  }

  static notNullOrEmpty<Type>(value: Type) {
    return pipe(Utils.isNullOrEmpty, not)(value);
  }

  static stringsToBigInts(collection: Array<string | undefined>) {
    return pipe(filter(Utils.notNullOrEmpty), map(BigInt))(collection);
  }

  static truncateString(str: string, maxLen = 35): string {
    if (str.length <= maxLen) {
      return str;
    }

    const maxHalfLength = Math.floor((maxLen - 3) / 2);
    const firstHalf = str.substring(0, maxHalfLength);
    const secondHalf = str.substring(str.length - maxHalfLength);

    // Find the last whitespace character in the first half
    const lastSpaceIndex = firstHalf.lastIndexOf(' ');
    const truncatedFirstHalf =
      lastSpaceIndex !== -1
        ? firstHalf.substring(0, lastSpaceIndex)
        : firstHalf;

    // Find the first whitespace character in the second half
    const nextSpaceIndex = secondHalf.indexOf(' ');
    const truncatedSecondHalf =
      nextSpaceIndex !== -1 ? secondHalf.substring(nextSpaceIndex) : secondHalf;

    return `${truncatedFirstHalf}...${truncatedSecondHalf}`;
  }
}

export const isBadRequestError = (
  error: RequestError | BadRequestError | void,
): error is BadRequestError => {
  return (error as BadRequestError).error_description !== undefined;
};
