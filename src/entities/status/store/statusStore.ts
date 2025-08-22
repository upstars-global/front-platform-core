import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  StatusDataResources,
  DynamicsSeasonInfoResources,
  DynamicStatusDataResources,
  StaticLevelDataResources,
} from '../api';
import { statusApi } from '../api';
import { log } from '../../../shared/helpers/log';

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

  async function loadStatusData() {
    isPending.value = true;
    try {
      const data = await statusApi.loadStatusData();
      setStatusData(data);
      return data;
    } catch (error: unknown) {
      log.error('LOAD_STATUS_DATA', error);
    } finally {
      isPending.value = false;
    }
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
    loadStatusData,
  };
});
