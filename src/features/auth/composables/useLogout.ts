import { authAPI, authEvents } from '../../../entities/auth';
import { beforeLogoutHook, clearUserDataHook } from '../config';
import { useUserProfileStore } from '../../../entities/user';
import { useWebsocketsController } from '../../../shared/libs/websockets';

export function useLogout() {
  const userProfileStore = useUserProfileStore();
  const websocketsController = useWebsocketsController();

  async function logout() {
    await beforeLogoutHook.run();
    const response = await authAPI.logout();
    userProfileStore.cleanUserInfo();
    userProfileStore.cleanContactsOnVerification();
    userProfileStore.setUserInfoLoaded(false);
    await clearUserDataHook.run();
    websocketsController.stop();

    authEvents.emit('logout');
    return response;
  }

  return {
    logout,
  };
}
