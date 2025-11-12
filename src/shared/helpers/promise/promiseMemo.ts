type PromiseMemoizerParams = {
  /**
   * Determines whether the resolved result of the promise should be cached.
   * If set to `true`, the promise result will be reused on later calls.
   * If `false` (default), the result will not be stored after resolution, and
   * the next call will re-execute the function.
   */
  cacheResult?: boolean;

  /**
   * A unique key used to identify and namespace the cached promise.
   * When provided, the memoized function will store and retrieve results
   * associated with this key. This enables shared caching across different
   * parts of the application.
   *
   * Example: "fetch-user", "load-settings"
   */
  key?: string;

  /**
   * Controls whether function arguments should be included in the internal cache key.
   * If `true` (default), the arguments passed to the function will be stringified
   * and used to distinguish different calls under the same key.
   * If `false`, all calls to the memoized function under the same key will share the same cache.
   *
   * Has no effect if `key` is not provided.
   */
  passArgumentsToKey?: boolean;
};

export type PromiseMemoizerCallback<T> = T & {
  clearCache(): void;
};

const cachedPromiseMemos = new Map<string, Map<'default' | string, Promise<unknown>>>();

// `any` is kept here because the wrapped callback must stay fully generic:
// it needs to accept **any** function signature without narrowing-down the
// arguments or breaking type inference elsewhere.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function promiseMemo<T extends (...args: any[]) => Promise<any>>(
  promiseCallback: T,
  params: PromiseMemoizerParams = {},
): PromiseMemoizerCallback<T> {
  type A = Parameters<T>;
  type R = Awaited<ReturnType<T>>;

  const { cacheResult = false, key, passArgumentsToKey = true } = params;

  let promise: Promise<R> | undefined = undefined;
  function clearCache(promiseKey?: 'default' | string) {
    promise = undefined;
    if (key) {
      if (promiseKey) {
        const cachedMap = cachedPromiseMemos.get(key);
        if (cachedMap) {
          cachedMap.delete(promiseKey);
          if (cachedMap.size === 0) {
            cachedPromiseMemos.delete(key);
          }
        }
      } else {
        cachedPromiseMemos.delete(key);
      }
    }
  }

  const wrapped = (...args: A) => {
    if (key) {
      const cachedMap = cachedPromiseMemos.get(key);

      const promiseKey = args.length > 0 && passArgumentsToKey ? JSON.stringify(args) : 'default';
      const cachedPromise = cachedMap?.get(promiseKey);
      if (cachedPromise) {
        return cachedPromise as Promise<R>;
      }
    }

    if (!promise) {
      promise = new Promise((resolve, reject) => {
        promiseCallback(...args)
          .then((data) => {
            if (!cacheResult) {
              clearCache();
            }
            resolve(data as R);
          })
          .catch((err) => {
            clearCache();

            reject(err);
          });
      });
    }

    if (key) {
      const cachedMap = cachedPromiseMemos.get(key);
      const promiseKey = args.length > 0 && passArgumentsToKey ? JSON.stringify(args) : 'default';
      if (!cachedMap) {
        cachedPromiseMemos.set(key, new Map([[promiseKey, promise]]));
      } else {
        cachedMap.set(promiseKey, promise);
      }
    }

    return promise;
  };
  wrapped.clearCache = () => {
    clearCache();
  };

  return wrapped as PromiseMemoizerCallback<T>;
}

export function promiseMemoClear(key: string, argumentsKey?: string) {
  const cachedMap = cachedPromiseMemos.get(key);
  if (cachedMap) {
    if (argumentsKey) {
      cachedMap.delete(argumentsKey);
    } else {
      cachedPromiseMemos.delete(key);
    }
  }
}

export function promiseMemoClearAll() {
  cachedPromiseMemos.clear();
}
