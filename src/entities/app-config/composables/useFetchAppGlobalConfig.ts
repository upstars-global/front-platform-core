import { configAPI } from '../api';
import { promiseMemo } from '../../../shared/helpers/promise';
import { useAppGlobalConfigStore } from '../store';
import type { Pinia } from 'pinia';

export function useFetchAppGlobalConfig(pinia?: Pinia) {
  const appGlobalConfigStore = useAppGlobalConfigStore(pinia);

  const loadAppGlobalConfig = promiseMemo(
    async () => {
      if (!appGlobalConfigStore.isLoaded) {
        return await configAPI.loadAppGlobalConfig();
      }

      return appGlobalConfigStore.globalConfig;
    },
    {
      key: 'loadAppGlobalConfig',
    },
  );

  return {
    loadAppGlobalConfig,
  };
}
