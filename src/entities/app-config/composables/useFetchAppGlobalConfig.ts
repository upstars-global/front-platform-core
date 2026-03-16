import { onMounted, onServerPrefetch } from 'vue';
import { configAPI } from '../api';
import { promiseMemo } from '../../../shared';
import { useAppGlobalConfigStore } from '../store';
import type { Pinia } from 'pinia';
import { useMultiLangStore } from '../../multilang';

export function useFetchAppGlobalConfig(pinia?: Pinia) {
  const appGlobalConfigStore = useAppGlobalConfigStore(pinia);
  const multiLangStore = useMultiLangStore(pinia);

  const loadAppGlobalConfig = promiseMemo(
    async () => {
      if (!appGlobalConfigStore.isLoaded) {
        const globalConfig = await configAPI.loadAppGlobalConfig();
        if (globalConfig) {
          appGlobalConfigStore.setGlobalConfig(globalConfig);
        }
        return globalConfig;
      }

      return appGlobalConfigStore.globalConfig;
    },
    {
      key: 'loadAppGlobalConfig',
    },
  );

  // During runtime SSR: if runtimeHostnameDuringSSR is set, the server knows the correct domain context.
  // API calls made here will include x-custom-host header (defined in front-app/src/appConfiguration.ts),
  // ensuring the correct domain-specific config is loaded.
  // without runtimeHostnameDuringSSR usage of loadAppGlobalConfig is deprecated on server!
  onServerPrefetch(async () => {
    if (!multiLangStore.runtimeHostnameDuringSSR) {
      // No domain context during SSR — config will be loaded at runtime via onMounted
      return;
    }
    if (!appGlobalConfigStore.isLoaded) {
      const config = await loadAppGlobalConfig();
      if (config) {
        appGlobalConfigStore.setGlobalConfig(config);
      }
    }
  });

  // For SPA, SSG modes do onMount
  onMounted(async () => {
    if (appGlobalConfigStore.isLoaded) {
      return;
    }
    const config = await loadAppGlobalConfig();
    if (config) {
      appGlobalConfigStore.setGlobalConfig(config);
    }
  });

  return {
    loadAppGlobalConfig,
  };
}
