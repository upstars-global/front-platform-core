import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { EnvironmentType } from '../types';
import { configEnvironment } from '../config';

export const useEnvironmentStore = defineStore('environment', () => {
  const baseUrl = ref(configEnvironment.getBaseUrl());
  const environment = ref<EnvironmentType>(configEnvironment.getEnvironment());
  const version = ref(configEnvironment.getVersion());
  const isMockerMode = ref(configEnvironment.getIsMockerMode());

  const isDev = computed(() => environment.value === EnvironmentType.DEVELOPMENT);
  const isStage = computed(() => environment.value === EnvironmentType.STAGING);
  const isProduction = computed(() => environment.value === EnvironmentType.PRODUCTION);

  return {
    baseUrl,
    environment,
    version,

    isDev,
    isStage,
    isProduction,
    
    isMockerMode,
  };
});
