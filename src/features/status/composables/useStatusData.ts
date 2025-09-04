import { computed } from 'vue';
import { useStatusStore } from '../../../entities/status';
import { useUserProfileStore } from '../../../entities/user';
import type {
  DynamicStatusDataResources,
  StaticLevelDataResources,
  DynamicsSeasonInfoResources,
} from '../../../entities/status';
import type { StatusProgressions } from '../../../entities/user';

export function useStatusData() {
  const statusStore = useStatusStore();
  const userProfileStore = useUserProfileStore();

  const seasonInfo = computed<DynamicsSeasonInfoResources | undefined>(() => statusStore.seasonInfo);

  const allStaticLevels = computed<StaticLevelDataResources[]>(() => statusStore.staticLevels || []);

  const dynamicStatuses = computed<DynamicStatusDataResources[]>(() => statusStore.dynamicStatuses || []);

  const staticLevels = computed<StaticLevelDataResources[]>(() => {
    const list = allStaticLevels.value || [];
    return list.length > 0 ? list.slice(0, -1) : list;
  });

  const dynamicStatusesCount = computed<number>(() => dynamicStatuses.value.length);
  const staticLevelsCount = computed<number>(() => staticLevels.value.length);

  // user progressions
  const progressions = computed<StatusProgressions | undefined>(() => userProfileStore.userInfo?.progressions);

  // current dynamic status: match by vipStatusCode against ALL statuses (not the filtered list)
  const currentDynamicStatus = computed<DynamicStatusDataResources | undefined>(() => {
    const code = progressions.value?.dynamic?.code;
    if (code == null) return undefined;
    return dynamicStatuses.value.find((status) => status.code === code);
  });

  // current static level: match by order == levelOrder against ALL levels (not the filtered list)
  const currentStaticLevel = computed<StaticLevelDataResources | undefined>(() => {
    const order = progressions.value?.static?.order;
    if (order == null) return undefined;
    return staticLevels.value.find((level) => level.order === order);
  });

  // dynamic status presence: if vipStatusCode is not null, user has a dynamic status (quarterly-confirmed)
  const isDynamicStatus = computed<boolean>(() => {
    return progressions.value?.dynamic?.code === 0;
  });

  // dynamic status confirmation flag: whether current dynamic status is confirmed
  const isDynamicStatusConfirmed = computed<boolean>(() => {
    return progressions.value?.dynamic?.isConfirmed === true;
  });

  return {
    // filtered collections
    dynamicStatuses,
    staticLevels,

    // counts of filtered collections
    dynamicStatusesCount,
    staticLevelsCount,

    // current status info
    currentDynamicStatus,
    currentStaticLevel,

    // presence flags
    isDynamicStatus,
    isDynamicStatusConfirmed,

    // user progressions passthrough
    progressions,

    // season info passthrough
    seasonInfo,
  };
}
