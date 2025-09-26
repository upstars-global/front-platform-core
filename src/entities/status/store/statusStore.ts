import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  StatusDataResources,
  DynamicsSeasonInfoResources,
  DynamicStatusDataResources,
  StaticLevelDataResources,
} from '../api';
import type { MappedDynStatus, MappedStaticLevel } from '../types';
import { adaptStaticLevels, adaptDynamicStatuses } from '../helpers/adapters';

export const useStatusStore = defineStore('statusData', () => {
  const statusData = ref<StatusDataResources | null>(null);
  const isPending = ref<boolean>(false);
  const isLoaded = ref<boolean>(false);

  const levels = ref<MappedStaticLevel[]>([]);
  const statuses = ref<MappedDynStatus[]>([]);

  function setStatusData(data: StatusDataResources | null) {
    statusData.value = data;
    levels.value = adaptStaticLevels(data?.staticProgressionConfig?.levels || null);
    statuses.value = adaptDynamicStatuses(data?.seasonConfig?.statuses || null);
    isLoaded.value = Boolean(data);
  }

  function reset() {
    setStatusData(null);
    isPending.value = false;
  }

  const seasonInfo = computed<DynamicsSeasonInfoResources | undefined>(() => {
    return statusData.value?.seasonConfig?.seasonInfo;
  });

  // @deprecated, use statuses instead
  const dynamicStatuses = computed<DynamicStatusDataResources[]>(() => {
    return statusData.value?.seasonConfig?.statuses || [];
  });

  // @deprecated, use levels instead
  const staticLevels = computed<StaticLevelDataResources[]>(() => {
    return statusData.value?.staticProgressionConfig?.levels || [];
  });

  return {
    statusData,
    levels,
    statuses,
    isPending,
    isLoaded,

    seasonInfo,
    dynamicStatuses,
    staticLevels,

    reset,
    setStatusData,
  };
});
