import type { IUserFeatureResource, IUserRefcodeResource } from '../api';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserInfoStore = defineStore('userInfo', () => {
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

  return {
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
