import { USER_REGULAR_STATUS, UserVipStatus } from '../api';
import type { IUserFeatureResource, IUserRefcodeResource, IUserStatusResource } from '../api';
import { Currency } from '../../../shared/api';
import { DEFAULT_CURRENCY } from '../../../shared/config';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserInfoStore = defineStore('userInfo', () => {
  function baseUserStatusData(): IUserStatusResource {
    return {
      userId: null,
      currency: DEFAULT_CURRENCY as Currency,
      currentStatus: 'NEW',
      currentStatusInt: 0,
      activeStatus: USER_REGULAR_STATUS,
      nextStatus: UserVipStatus.BRONZE,
      nextStatusInt: 0,
      depositAmountCents: 0,
      depositThresholdCents: 0,
      betSumCents: 0,
      betSumThresholdCents: 0,
      overallProgress: 0,
    };
  }

  const userStatusData = ref<IUserStatusResource>(baseUserStatusData());

  function setUserStatusData(data: IUserStatusResource) {
    userStatusData.value = data;
  }

  const availableFeatures = ref<IUserFeatureResource[]>([]);

  function setUserFeatures(data: IUserFeatureResource[]) {
    availableFeatures.value = data;
  }

  const availableFeaturesLoaded = ref(false);

  function setAvailableFeaturesLoaded(value: boolean) {
    availableFeaturesLoaded.value = value;
  }

  const userBettingToken = ref<string>();

  function setUserBettingToken(data: string) {
    userBettingToken.value = data;
  }

  function isFeatureAvailable(featureName: string) {
    const feature = availableFeatures.value.find((featureItem) => {
      return featureItem.feature === featureName;
    });

    return feature && feature.isAvailable;
  }

  const refcode = ref<IUserRefcodeResource>({
    isLoaded: false,
    types: [], //  "Betting", "Gambling" ...
  });
  
  function setRefcode(data: IUserRefcodeResource) {
    refcode.value = data;
  }

  const isUserHasBettingRefcode = computed(() => {
    return refcode.value.types.includes('Betting');
  });

  function cleanUserStatusData() {
    userStatusData.value = baseUserStatusData();
  }

  return {
    userStatusData,
    setUserStatusData,
    cleanUserStatusData,

    availableFeatures,
    setUserFeatures,

    availableFeaturesLoaded,
    setAvailableFeaturesLoaded,
    isFeatureAvailable,

    userBettingToken,
    setUserBettingToken,

    refcode,
    setRefcode,
    isUserHasBettingRefcode,
  };
});
