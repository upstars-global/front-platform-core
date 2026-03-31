import { useLimitsStore } from '../../../entities/limits';
import { computed } from 'vue';
import { useUserProfile, useUserProfileStore, SelfExclusionStatus } from '../../../entities/user';

export function useCoolingOffStatus() {
  const limitsStore = useLimitsStore();
  const { isLoggedAsync } = useUserProfile();
  const userProfileStore = useUserProfileStore();

  const isCoolingOff = computed(() => {
    return userProfileStore.userInfo.selfExclusionStatus === SelfExclusionStatus.COOLING_OFF_ACTIVE;
  });

  const coolingOffDate = computed(() => {
    const date = limitsStore?.selfExclusionLimit?.tillDate;
    if (date) {
      return new Date(date);
    }
  });

  async function checkIsCoolingOff() {
    await Promise.all([isLoggedAsync(), limitsStore.loadSelfExclusionLimit()]);

    return isCoolingOff.value;
  }

  return {
    isCoolingOff,
    coolingOffDate,
    checkIsCoolingOff,
  };
}
