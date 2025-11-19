import { useUserProfile } from '../../../entities/user';
import { useFetchAllUserData } from './useFetchAllUserData';
import { JsonHttpServerError } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import { useMultiLangUpdateLocale } from '../../../features/multilang';
import { useUserProfileStore } from '../../../entities/user/store';

export function useInitAuth() {
  const { isLoggedAsync, } = useUserProfile();
  const userProfileStore = useUserProfileStore();
  const { fetchAllUserData } = useFetchAllUserData();
  const { updateLocalUserLocale } = useMultiLangUpdateLocale();

  function handleInitAuthError(error: unknown) {
    log.error('INIT_AUTH_ERROR', error);
    if (error instanceof JsonHttpServerError) {
      if (error.error.status === 401 && typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  async function initAuth() {
    try {
      const isLogged = await isLoggedAsync();
      
      if (isLogged) {
        await fetchAllUserData({
          isInit: true,
        });

        const localizedUrl = await updateLocalUserLocale({
          locale: userProfileStore.userInfo.localization,
          redirectUrl: window.location.pathname + window.location.search,
        });
    
        if (localizedUrl) {
          window.location.href = localizedUrl;
        }
      }
    } catch (error: unknown) {
      handleInitAuthError(error);
    }
  }

  return {
    initAuth,
  };
}
