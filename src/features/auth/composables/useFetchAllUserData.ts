import { useUserProfile, userEvents } from '../../../entities/user';
import { promiseMemo, safePromiseAll } from '../../../shared/helpers/promise';
import { useWebsocketsController } from '../../../shared/libs/websockets';
import { afterProfileDataLoadedHook, fetchUserDataHook } from '../config';

export type FetchAllUserDataOptions = {
  isInit: boolean;
};

export function useFetchAllUserData() {
  const { loadUserProfile, loadUserContactsOnVerification } = useUserProfile();
  const websocketsController = useWebsocketsController();

  async function loadUserProfileHandler() {
    const userProfile = await loadUserProfile();
    userEvents.emit('profile.loaded', userProfile);
    await afterProfileDataLoadedHook.run();
    return userProfile;
  }

  const fetchAllUserData = promiseMemo(
    async (options?: FetchAllUserDataOptions) => {
      await safePromiseAll([
        loadUserProfileHandler().then((profile) => {
          websocketsController.start(profile.hash);
        }),
        loadUserContactsOnVerification(),

        // temporary solution until all stores will be transferred to the core package,
        // and even then it may stay for brand customization purpose such as 3d party integration
        fetchUserDataHook.run({
          isInit: options?.isInit,
        }),
      ]);
    },
    {
      key: 'fetchAllUserData',
      passArgumentsToKey: false,
    },
  );

  return {
    fetchAllUserData,
  };
}
