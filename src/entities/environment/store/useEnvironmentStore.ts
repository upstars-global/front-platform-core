import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { EnvironmentType } from '../types';

const DEVELOPMENT_ENV = EnvironmentType.DEVELOPMENT;
const STAGING_ENV = EnvironmentType.STAGING;
const PRODUCTION_ENV = EnvironmentType.PRODUCTION;

export const useEnvironmentStore = defineStore('environment', () => {
  const baseUrl = ref('/');
  const environment = ref<EnvironmentType>(typeof ENVIRONMENT !== 'undefined' ? ENVIRONMENT : PRODUCTION_ENV);
  const version = ref('');
  const isMockerMode = ref(false);

  const isDev = computed(() => environment.value === DEVELOPMENT_ENV);
  const isStage = computed(() => environment.value === STAGING_ENV);
  const isProduction = computed(() => environment.value === PRODUCTION_ENV);

  return {
    baseUrl,
    environment,
    isDev,
    isStage,
    isProduction,
    isMockerMode,
    version,
  };
});
