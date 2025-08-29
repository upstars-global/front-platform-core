import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  StatusDataResources,
  DynamicsSeasonInfoResources,
  DynamicStatusDataResources,
  StaticLevelDataResources,
} from '../api';

export const useStatusStore = defineStore('statusData', () => {
  const statusData = ref<StatusDataResources | null>(null);
  const isPending = ref<boolean>(false);
  const isLoaded = ref<boolean>(false);

  function setStatusData(data: StatusDataResources | null) {
    statusData.value = data;
    isLoaded.value = Boolean(data);
  }

  function reset() {
    setStatusData(null);
    isPending.value = false;
  }

  const seasonInfo = computed<DynamicsSeasonInfoResources | undefined>(() => {
    return statusData.value?.seasonConfig?.seasonInfo;
  });

  const dynamicStatuses = computed<DynamicStatusDataResources[]>(() => {
    return statusData.value?.seasonConfig?.statuses || [];
  });

  const staticLevels = computed<StaticLevelDataResources[]>(() => {
    return statusData.value?.staticProgressionConfig?.levels || [];
  });

  return {
    statusData,
    isPending,
    isLoaded,

    seasonInfo,
    dynamicStatuses,
    staticLevels,

    reset,
    setStatusData,
  };
});
