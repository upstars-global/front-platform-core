import { useLocalStorageValueByController } from '../composables/useLocalStorageValue';
import { localStorageKeyControllerFactory } from './localStorageKeyControllerFactory';
import { type LocalStorageConfig, LocalStorageKey } from '../config';

export function localStorageKeyComposableFactory<K extends LocalStorageKey>(
  key: K,
): ReturnType<typeof useLocalStorageValueByController<ReturnType<LocalStorageConfig[K]['defaultValue']>>> {
  return useLocalStorageValueByController(localStorageKeyControllerFactory<K>(key));
}
