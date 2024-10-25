import { either, filter, isEmpty, isNil, map, not, pipe } from 'ramda';
import { BadRequestError, RequestError } from './tryFetch';
import { SingleSSOAPIResponse } from '../api/ssoAPI';
import { SSOModel } from '../../stores/SSOStore';

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

  static isNetworkError(error: RequestError | void): boolean {
    return !!error && error.message === 'Network request failed';
  }

  static isPromiseFulfilled = <T>(
    input: PromiseSettledResult<T>,
  ): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
}

export const isBadRequestError = (
  error: RequestError | BadRequestError | void,
): error is BadRequestError => {
  return (
    (error as BadRequestError)?.error !== undefined ||
    (error as BadRequestError)?.errorCode !== undefined
  );
};

export const mapSingle = (resp: SingleSSOAPIResponse): SSOModel | undefined => {
  const pisaId = Utils.zeroToUndefined<number>(+resp.pisaId);
  if (pisaId === undefined || Utils.isNullOrEmpty(resp.name)) {
    return undefined;
  }

  const address = [
    resp.streetAddress1,
    resp.streetAddress2,
    resp.city,
    resp.zipCode,
    resp.state,
    resp.country,
  ]
    .filter(Utils.notNullOrEmpty)
    .join(', ');

  return {
    pisaId: pisaId,
    address: address,
    name: resp.name,
    pillarId: resp.id,
    msoPillarId: resp.msoId,
    distributorId: resp.distributorId,
    distributorName: resp.distributor,
    isIntegrated: !isEmpty(resp.integrations),
  };
};
