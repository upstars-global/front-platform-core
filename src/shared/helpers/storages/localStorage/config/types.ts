import { type LocalStorageKeyControllerOptions } from '../controllers/keyController';

export type LocalStorageKeysMap = Record<string, number | boolean | null>;

export type LocalStorageConfig<
  T extends keyof M,
  M extends Record<string, number | boolean | null> = LocalStorageKeysMap,
> = {
  [K in T]: LocalStorageKeyControllerOptions<M[K]>;
};
