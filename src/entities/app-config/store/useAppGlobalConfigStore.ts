import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { AppGlobalConfig } from '../types';

export const useAppGlobalConfigStore = defineStore('appGlobalConfig', () => {
  const isLoaded = ref(false);
  const globalConfig = ref<AppGlobalConfig>();

  function setGlobalConfig(config: AppGlobalConfig) {
    globalConfig.value = config;
    isLoaded.value = true;
  }

  const supportEmail = computed(() => {
    return globalConfig.value?.supportEmail || '';
  });

  const licenceDomainConfig = computed(() => {
    return globalConfig.value?.licenceDomainConfig;
  });

  const isLicenceDomain = computed(() => {
    return Boolean(licenceDomainConfig.value?.licenceId);
  });

  const isSelfExclusionEnabled = computed(() => {
    return Boolean(globalConfig.value?.selfExclusionEnabled);
  });

  const freshChatConfig = computed(() => {
    return globalConfig.value?.freshChatConfig;
  });
  const betsHistoryEnabled = computed(() => {
    return globalConfig.value?.betsHistoryEnabled;
  });


  return {
    isLoaded,
    globalConfig,

    supportEmail,
    licenceDomainConfig,
    isLicenceDomain,

    isSelfExclusionEnabled,
    betsHistoryEnabled,

    freshChatConfig,

    setGlobalConfig,
  };
});
