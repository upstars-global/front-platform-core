import { log } from '../log';

export type PromiseHook<T = void> = (arg: T) => Promise<void>;
export type CreatePromiseHookOptions = {
  // just log error if hook failed
  hookError: string;
  // will trigger error on hook execution if hook not present
  hookNotExistError?: string;
};

// return true or false depending on a hook existence and promise result
export function createPromiseHook<T = void>(options: CreatePromiseHookOptions) {
  const { hookError, hookNotExistError } = options;

  let hook: PromiseHook<T> | null = null;

  function set(newHook: PromiseHook<T> | null) {
    hook = newHook;
  }
  async function run(arg: T) {
    if (!hook && hookNotExistError) {
      throw new Error(hookNotExistError);
    }
    try {
      if (hook) {
        await hook(arg);
      }
      return true;
    } catch (error: unknown) {
      log.error(hookError, error);
    }
    return false;
  }

  return {
    set,
    run,
  };
}
