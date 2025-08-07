import { type LocalStorageKeyControllerOptions, LocalStorageKeyController } from '../controllers/keyController';
import { type LocalStorageConfig, LocalStorageKey, LocalStorageConfigMap } from '../config';

export function localStorageKeyControllerFactory<K extends LocalStorageKey>(
  key: K,
): LocalStorageKeyController<ReturnType<LocalStorageConfig[K]['defaultValue']>> {
  const params = LocalStorageConfigMap[key] as LocalStorageKeyControllerOptions<
    ReturnType<LocalStorageConfig[K]['defaultValue']>
  >;
  return new LocalStorageKeyController(key, params);
}
