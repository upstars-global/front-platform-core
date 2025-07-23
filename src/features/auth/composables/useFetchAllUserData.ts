import { useUserProfile, userEvents } from '../../../entities/user';
import { promiseMemo, safePromiseAll } from '../../../shared/helpers/promise';
import { afterProfileDataLoadedHook, fetchUserDataHook } from '../config';
import { localeUpdateHook } from '../config/locale';

export type FetchAllUserDataOptions = {
  isInit: boolean;
};

export function useFetchAllUserData() {
  const { loadUserProfile, loadUserContactsOnVerification } = useUserProfile();

  async function loadUserProfileHandler() {
    const userProfile = await loadUserProfile();
    if (userProfile?.localization) {
      await localeUpdateHook.run({
        locale: userProfile.localization,
      });
    }
    userEvents.emit('profile.loaded', userProfile);
    return afterProfileDataLoadedHook.run();
  }

  const fetchAllUserData = promiseMemo(
    async (options?: FetchAllUserDataOptions) => {
      await safePromiseAll([
        loadUserProfileHandler(),
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
