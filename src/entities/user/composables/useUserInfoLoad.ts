import type { Pinia } from "pinia";
import { useUserInfoStore } from "../store/userInfoStore";
import { promiseMemo } from "../../../shared/helpers/promise";
import { userAPI } from "../api";

export function useUserInfoLoad(pinia?: Pinia) {
  const userInfoStore = useUserInfoStore(pinia);

  const loadUserFeatures = promiseMemo(
    async () => {
      userInfoStore.setAvailableFeaturesLoaded(false);

      const data = await userAPI.loadUserFeatures();

      userInfoStore.setUserFeatures(data);

      userInfoStore.setAvailableFeaturesLoaded(true);

      return data;
    },
    {
      key: 'loadUserFeatures',
    },
  );

  async function loadUserBettingToken() {
    const data = await userAPI.loadUserBettingToken();

    userInfoStore.setUserBettingToken(data.token);

    return data.token;
  }

  async function loadRefcodeTypes() {
    const types: string[] = await userAPI.loadRefcodeTypes();

    userInfoStore.setRefcode({
      isLoaded: true,
      types,
    });
  }

  const loadUserStatusData = promiseMemo(
    async () => {
      const data = await userAPI.loadUserStatusData();

      if (data) {
        userInfoStore.setUserStatusData(data);
      }

      return data;
    },
    {
      key: 'loadUserStatusData',
    },
  );

  return {
    loadUserFeatures,
    loadUserBettingToken,
    loadRefcodeTypes,
    loadUserStatusData,
  };
}