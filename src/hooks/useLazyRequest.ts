import { useCallback, useState } from 'react';

interface LazyRequestResult<TResult> {
  isLoading: boolean;
  result?: TResult;
}

const INIT_RESULT_STATE = { isLoading: false };

const useLazyRequest = <
  TRequest extends (
    ...args: Parameters<TRequest>
  ) => Promise<Awaited<ReturnType<TRequest>>>,
>(
  request: TRequest,
): readonly [
  (...args: Parameters<TRequest>) => Promise<ReturnType<TRequest>>,
  LazyRequestResult<Awaited<ReturnType<TRequest>>>,
] => {
  const [requestResult, setRequestResult] =
    useState<LazyRequestResult<Awaited<ReturnType<TRequest>>>>(
      INIT_RESULT_STATE,
    );

  const executeRequest = useCallback<
    (...args: Parameters<TRequest>) => Promise<ReturnType<TRequest>>
  >(
    async (...args) => {
      setRequestResult({ isLoading: true });
      const result = await request(...args);
      setRequestResult({ isLoading: false, result });
      return result;
    },
    [request],
  );

  return [executeRequest, requestResult] as const;
};

export default useLazyRequest;
