import { computed } from 'vue';
import type {
  DynamicsSeasonInfoResources,
  DynamicStatusDataResources,
  StaticLevelDataResources,
} from '../../../entities/status';
import { useStatusStore } from '../../../entities/status';
import type { StatusProgressions } from '../../../entities/user';
import { UserStatusResource, useUserProfileStore } from '../../../entities/user';
import { type LevelOrStatus, type PointsData, ProgressionType } from '../types';

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

  // dynamic status presence: true when code exists and is >= BASE_VIP (quarterly-confirmed)
  const isDynamicStatus = computed<boolean>(() => {
    const code = progressions.value?.dynamic?.code;
    return code != null && code >= UserStatusResource.BASE_VIP;
  });

  // dynamic status confirmation flag: whether current dynamic status is confirmed
  const isDynamicStatusConfirmed = computed<boolean>(() => {
    return progressions.value?.dynamic?.isConfirmed === true;
  });

  const isDynamicStatusAutoConfirmed = computed<boolean>(() => {
    return progressions.value?.dynamic?.isAutoConfirmed === true;
  });

  const mappedDynamicStatuses = computed(() => {
    return statusStore.statuses;
  });

  const currentMappedDynamicStatus = computed(() => {
    const code = progressions.value?.dynamic?.code;
    if (!code) return undefined;
    return mappedDynamicStatuses.value.find((status) => status.data.code === code);
  });

  const mappedProgressionSP = computed(() => {
    const { sp = 0 } = progressions.value?.dynamic || {};
    if (currentMappedDynamicStatus.value) {
      return currentMappedDynamicStatus.value.spFrom + sp;
    }
    return sp;
  });

  const mappedStaticLevels = computed(() => {
    return statusStore.levels;
  });

  const currentMappedStaticLevel = computed(() => {
    const order = progressions.value?.static?.order;
    if (typeof order !== 'number') return undefined;
    return mappedStaticLevels.value.find((level) => level.data.order === order);
  });

  const mappedProgressionXP = computed(() => {
    const { xp = 0 } = progressions.value?.static || {};
    if (currentMappedStaticLevel.value) {
      return currentMappedStaticLevel.value.xpFrom + xp;
    }
    return xp;
  });

  const currentLevelOrStatus = computed<LevelOrStatus | undefined>(() => {
    if (currentMappedDynamicStatus.value) {
      return {
        type: ProgressionType.DYNAMIC,
        data: currentMappedDynamicStatus.value,
      };
    }
    if (currentMappedStaticLevel.value) {
      return {
        type: ProgressionType.STATIC,
        data: currentMappedStaticLevel.value,
      };
    }
    return undefined;
  });

  const isLastStatus = computed(() => {
    const currentLevelOrStatusValue = currentLevelOrStatus.value;
    if (currentLevelOrStatusValue?.type === ProgressionType.DYNAMIC) {
      const index = statusStore.statuses.findIndex((status) => {
        return status.data.code === currentLevelOrStatusValue.data.data.code;
      });
      return index === statusStore.statuses.length - 1;
    }
    return false;
  });

  const isLastLevel = computed(() => {
    const currentLevelOrStatusValue = currentLevelOrStatus.value;
    if (currentLevelOrStatusValue?.type === ProgressionType.STATIC) {
      const index = statusStore.levels.findIndex((level) => {
        return level.data.order === currentLevelOrStatusValue.data.data.order;
      });
      return index === statusStore.levels.length - 1;
    }
    return false;
  });

  const nextLevelOrStatus = computed<LevelOrStatus | undefined>(() => {
    if (isLastStatus.value) {
      return currentLevelOrStatus.value;
    }

    if (isLastLevel.value) {
      return {
        type: ProgressionType.DYNAMIC,
        data: statusStore.statuses[0],
      };
    }

    const code = progressions.value?.dynamic?.code;
    if (code) {
      const status = statusStore.statuses.find((status) => status.data.code > code);
      if (status) {
        return {
          type: ProgressionType.DYNAMIC,
          data: status,
        };
      }
    }

    const order = progressions.value?.static?.order;
    if (order) {
      const level = statusStore.levels.find((level) => level.data.order > order);
      if (level) {
        return {
          type: ProgressionType.STATIC,
          data: level,
        };
      }
    }

    return undefined;
  });

  const currentProgressionType = computed<ProgressionType>(() => {
    return currentLevelOrStatus.value?.type || ProgressionType.STATIC;
  });

  const pointsData = computed<PointsData>(() => {
    if (currentLevelOrStatus.value) {
      const { data, type } = currentLevelOrStatus.value;
      if (type === ProgressionType.STATIC) {
        return {
          type,
          current: mappedProgressionXP.value,
          fromConfirm: data.xpFrom,
          from: data.xpFrom,
          to: data.xpTo,
          confirm: null,
        };
      }

      const { isConfirmed = true, isAutoConfirmed = true } = progressions.value?.dynamic || {};

      let to = data.spTo;
      let from = data.spFrom;
      let current = mappedProgressionSP.value;
      const confirm = isConfirmed ? null : data.confirmTo;

      if (isLastStatus.value) {
        from = 0;

        if (!isConfirmed) {
          to = data.confirmTo;
        } else {
          if (!isAutoConfirmed) {
            to = data.confirmTo;
          }
          current = to;
        }
      }

      return {
        confirm,
        to,
        from,
        current,
        fromConfirm: data.spFrom,
        type,
      };
    }

    return {
      type: ProgressionType.STATIC,
      current: 0,
      confirm: null,
      to: 0,
      from: 0,
      fromConfirm: 0,
    };
  });

  return {
    // filtered collections
    dynamicStatuses,
    staticLevels,

    mappedDynamicStatuses,
    currentMappedDynamicStatus,
    mappedProgressionSP,

    mappedStaticLevels,
    currentMappedStaticLevel,
    mappedProgressionXP,

    currentLevelOrStatus,
    nextLevelOrStatus,
    isLastStatus,
    isLastLevel,
    currentProgressionType,

    pointsData,

    // counts of filtered collections
    dynamicStatusesCount,
    staticLevelsCount,

    // current status info
    currentDynamicStatus,
    currentStaticLevel,

    // presence flags
    isDynamicStatus,
    isDynamicStatusConfirmed,
    isDynamicStatusAutoConfirmed,

    // user progressions passthrough
    progressions,

    // season info passthrough
    seasonInfo,
  };
}
