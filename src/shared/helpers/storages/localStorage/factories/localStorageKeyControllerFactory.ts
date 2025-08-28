import { type LocalStorageKeyControllerOptions, LocalStorageKeyController } from '../controllers/keyController';
import { type LocalStorageConfig, type LocalStorageKeysMap } from '../config';

export function localStorageKeyControllerFactory<
  K extends keyof LocalStorageKeysMap,
  M extends LocalStorageKeysMap = LocalStorageKeysMap,
>(
  key: K,
  config: LocalStorageConfig<K, M>,
): LocalStorageKeyController<ReturnType<LocalStorageConfig<K, M>[K]['defaultValue']>> {
  const params = config[key] as LocalStorageKeyControllerOptions<
    ReturnType<LocalStorageConfig<K, M>[K]['defaultValue']>
  >;
  return new LocalStorageKeyController(key, params);
}
