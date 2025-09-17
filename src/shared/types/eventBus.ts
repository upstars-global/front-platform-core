type CallbackHandler<T> = ((args?: T) => void) | ((...args: T[]) => void)

/** @deprecated
 * for transfer and back compatibility, must be deleted in the end
 * use scoped typed emitters (within specific lib, entity, or feature)
 */
export type EventBus = {
  $on<T = unknown>(event: string, callback: CallbackHandler<T>): void
  $off<T = unknown>(event: string, callback: CallbackHandler<T>): void
  $emit(event: string, ...args: unknown[]): void
  $once(event: string, callback: (...args: unknown[]) => void): void
};
