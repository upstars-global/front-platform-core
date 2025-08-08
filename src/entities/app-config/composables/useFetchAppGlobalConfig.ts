import { configAPI } from '../api';
import { type AppGlobalConfig } from '../types';
import { promiseMemo } from '../../../shared/helpers/promise';
import { useAppGlobalConfigStore } from '../store';
import type { Pinia } from 'pinia';

export const loadGlobalConfig = promiseMemo(async () => {
  return await configAPI.loadAppGlobalConfig();
});

export function useFetchAppGlobalConfig(pinia?: Pinia) {
  const appGlobalConfigStore = useAppGlobalConfigStore(pinia);

  async function loadAppGlobalConfig(): Promise<AppGlobalConfig | undefined> {
    if (!appGlobalConfigStore.isLoaded) {
      return await loadGlobalConfig();
    }
    return appGlobalConfigStore.globalConfig;
  }

  return {
    loadAppGlobalConfig,
  };
}
