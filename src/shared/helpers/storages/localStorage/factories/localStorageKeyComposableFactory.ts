import { useLocalStorageValueByController } from '../composables/useLocalStorageValue';
import { localStorageKeyControllerFactory } from './localStorageKeyControllerFactory';
import { type LocalStorageConfig, type LocalStorageKeysMap } from '../config';

export function localStorageKeyComposableFactory<
  K extends keyof LocalStorageKeysMap,
  M extends LocalStorageKeysMap = LocalStorageKeysMap,
>(
  key: K,
  config: LocalStorageConfig<K, M>,
): ReturnType<typeof useLocalStorageValueByController<ReturnType<LocalStorageConfig<K, M>[K]['defaultValue']>>> {
  return useLocalStorageValueByController(localStorageKeyControllerFactory<K, M>(key, config));
}
