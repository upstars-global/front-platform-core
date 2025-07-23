import { authAPI, authEvents } from '../../../entities/auth';
import { beforeLogoutHook, clearUserDataHook } from '../config';
import { useUserProfileStore } from '../../../entities/user';

export function useLogout() {
  const userProfileStore = useUserProfileStore();

  async function logout() {
    await beforeLogoutHook.run();
    const response = await authAPI.logout();
    userProfileStore.cleanUserInfo();
    userProfileStore.cleanContactsOnVerification();
    userProfileStore.setUserInfoLoaded(false);
    await clearUserDataHook.run();
    authEvents.emit('logout');
    return response;
  }

  return {
    logout,
  };
}
