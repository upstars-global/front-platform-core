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

  // season info passthrough
  const seasonInfo = computed<DynamicsSeasonInfoResources | undefined>(() => statusStore.seasonInfo);

  // full arrays from store
  const allDynamicStatuses = computed<DynamicStatusDataResources[]>(() => statusStore.dynamicStatuses || []);
  const allStaticLevels = computed<StaticLevelDataResources[]>(() => statusStore.staticLevels || []);

  // filtered arrays: remove the last element if any
  const dynamicStatuses = computed<DynamicStatusDataResources[]>(() => {
    const list = allDynamicStatuses.value || [];
    return list.length > 0 ? list.slice(0, -1) : list;
  });

  const staticLevels = computed<StaticLevelDataResources[]>(() => {
    const list = allStaticLevels.value || [];
    return list.length > 0 ? list.slice(0, -1) : list;
  });

  // counts for filtered lists
  const dynamicStatusesCount = computed<number>(() => dynamicStatuses.value.length);
  const staticLevelsCount = computed<number>(() => staticLevels.value.length);

  // user progressions
  const progressions = computed<StatusProgressions | undefined>(() => userProfileStore.userInfo?.progressions);

  // current dynamic status: match by vipStatusCode against ALL statuses (not the filtered list)
  const currentDynamicStatus = computed<DynamicStatusDataResources | undefined>(() => {
    const code = progressions.value?.dynamic?.vipStatusCode;
    if (code == null) return undefined;
    return allDynamicStatuses.value.find((s) => s.code === code);
  });

  // current static level: match by order == levelOrder against ALL levels (not the filtered list)
  const currentStaticLevel = computed<StaticLevelDataResources | undefined>(() => {
    const levelOrder = progressions.value?.static?.levelOrder;
    if (levelOrder == null) return undefined;
    return allStaticLevels.value.find((l) => l.order === levelOrder);
  });

  // user level for display: levelOrder + 1
  const currentUserLevelNumber = computed<number>(() => {
    const levelOrder = progressions.value?.static?.levelOrder;
    // If undefined, return 0 as a safe default display value
    return levelOrder != null ? levelOrder + 1 : 0;
  });

  // dynamic status presence: if vipStatusCode is not null, user has a dynamic status (quarterly-confirmed)
  const isDynamicStatus = computed<boolean>(() => {
    return progressions.value?.dynamic?.vipStatusCode != null;
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
    currentUserLevelNumber,

    // presence flags
    isDynamicStatus,

    // user progressions passthrough
    progressions,

    // season info passthrough
    seasonInfo,
  };
}
