type SafePromiseResultSuccess<T> = {
  success: true;
  result: T;
};
type SafePromiseResultError = {
  success: false;
  error: unknown;
};
type SafePromiseResult<T> = SafePromiseResultSuccess<T> | SafePromiseResultError;

export function safePromise<T>(promise: Promise<T>): Promise<SafePromiseResult<T>> {
  return promise
    .then<SafePromiseResultSuccess<T>>((result) => ({ success: true, result }))
    .catch<SafePromiseResultError>((error: unknown) => ({ success: false, error }));
}

export function safePromiseAll<const P extends readonly Promise<unknown>[]>(
  promises: P,
): Promise<{
  [I in keyof P]: SafePromiseResult<Awaited<P[I]>>;
}> {
  const wrapped = promises.map((p) => safePromise(p));
  return Promise.all(wrapped) as Promise<{
    [I in keyof P]: SafePromiseResult<Awaited<P[I]>>;
  }>;
}
