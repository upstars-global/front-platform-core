import { watch } from 'vue';
import { limitsAPI, useLimitsStore } from '../../../entities/limits';
import { useWebsocketsStatusStore } from '../../../shared/libs/websockets';
import { useUserProfile } from '../../../entities/user';

export type UseGetToken = () => {
  getToken: () => Promise<string | null>;
};

export function useCoolingOffToken(
  useGetToken: UseGetToken,
  expiredCallback?: () => void
) {
  const { getToken } = useGetToken();
  const { isLoggedAsync, loadUserProfile } = useUserProfile();
  const websocketStatusStore = useWebsocketsStatusStore();
  const limitsStore = useLimitsStore();

  function websocketConnectAsync(timeout = 5000) {
    return new Promise<void>((resolve) => {
      const stop = watch(
        () => websocketStatusStore.isConnected,
        (isConnected) => {
          if (isConnected) {
            stop();
            resolve();
          }
        },
        {
          immediate: true,
        },
      );

      setTimeout(() => {
        resolve();
        stop();
      }, timeout);
    });
  }

  async function handleCoolingOffToken() {
    const coolingOffToken = await getToken();
    const isLogged = await isLoggedAsync();

    if (coolingOffToken) {
      if (!isLogged) {
        return false;
      }
      await websocketConnectAsync();

      const status = await limitsAPI.activateCoolingOff(coolingOffToken);

      if (!status) {
        if (expiredCallback) {
          expiredCallback();
        }
      } else {
        await Promise.all([loadUserProfile({ reload: true }), limitsStore.loadSelfExclusionLimit()]);
      }

      return true;
    }
    return false;
  }

  return {
    handleCoolingOffToken,
  };
}
