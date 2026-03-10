import { defineStore } from 'pinia';
import { ref } from 'vue';
import { limitsAPI } from '../api/requests';
import type { IDisableLimitDTO, ILimitResource, IManageLimitDTO } from '../api/types';
import { LimitType, LimitSubtype } from '../api/types';

export const LIMITS_SUBTYPE_ORDER: Record<LimitSubtype, number> = {
  [LimitSubtype.DAILY]: 1,
  [LimitSubtype.WEEKLY]: 2,
  [LimitSubtype.MONTHLY]: 3,
};

function sortLimitsBySubtype<T extends LimitType = LimitType>(limits: Array<ILimitResource<T>>) {
  return [...limits].sort((limitA, limitB) => {
    return LIMITS_SUBTYPE_ORDER[limitA.subType] - LIMITS_SUBTYPE_ORDER[limitB.subType];
  });
}

interface ILimitsByType {
  [LimitType.DEPOSIT]: Array<ILimitResource<LimitType.DEPOSIT>>;
  [LimitType.LOSS]: Array<ILimitResource<LimitType.LOSS>>;
}

// Simple promise memoizer to prevent multiple simultaneous requests
function createPromiseMemoizer<T>(fn: () => Promise<T>) {
  let promise: Promise<T> | null = null;

  const memoized = () => {
    if (!promise) {
      promise = fn().finally(() => {
        promise = null;
      });
    }
    return promise;
  };

  return memoized;
}

export const useLimitsStore = defineStore('limits', () => {
  const limits = ref<ILimitsByType>({
    [LimitType.DEPOSIT]: [],
    [LimitType.LOSS]: [],
  });
  const selfExclusionLimit = ref<ILimitResource<LimitType.SELF_EXCLUSION>>();

  async function loadLimits() {
    await Promise.all([loadLossLimits(), loadDepositLimits(), loadSelfExclusionLimit()]);
  }

  async function loadLimitsByType(type: LimitType) {
    if (type === LimitType.DEPOSIT) {
      await loadDepositLimits();
    } else if (type === LimitType.LOSS) {
      await loadLossLimits();
    }
  }

  const loadDepositLimits = createPromiseMemoizer(async () => {
    limits.value[LimitType.DEPOSIT] = sortLimitsBySubtype(
      await limitsAPI.getActiveLimits(LimitType.DEPOSIT)
    );
  });

  const loadLossLimits = createPromiseMemoizer(async () => {
    limits.value[LimitType.LOSS] = sortLimitsBySubtype(await limitsAPI.getActiveLimits(LimitType.LOSS));
  });

  const loadSelfExclusionLimit = createPromiseMemoizer(async () => {
    const [limit] = await limitsAPI.getActiveLimits(LimitType.SELF_EXCLUSION);
    if (limit) {
      selfExclusionLimit.value = limit;
    }
  });

  async function createLimit(params: IManageLimitDTO) {
    const { data, error } = await limitsAPI.createLimit(params);
    if (data) {
      loadLimitsByType(params.type);
      return;
    }
    throw error;
  }

  async function updateLimit(params: IManageLimitDTO) {
    const { data, error } = await limitsAPI.updateLimit(params);
    if (data) {
      loadLimitsByType(params.type);
      return;
    }
    throw error;
  }

  async function disableLimit(params: IDisableLimitDTO) {
    const { data, error } = await limitsAPI.disableLimit(params);
    if (data) {
      loadLimitsByType(params.type);
      return;
    }
    throw error;
  }

  return {
    limits,
    selfExclusionLimit,
    loadLimitsByType,
    loadSelfExclusionLimit,

    loadLimits,
    createLimit,
    updateLimit,
    disableLimit,
  };
});
