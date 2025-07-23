import { useUserProfile } from '../../../entities/user';
import { useFetchAllUserData } from './useFetchAllUserData';
import { JsonHttpServerError } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';

export function useInitAuth() {
  const { isLoggedAsync } = useUserProfile();
  const { fetchAllUserData } = useFetchAllUserData();

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
      }
    } catch (error: unknown) {
      handleInitAuthError(error);
    }
  }

  return {
    initAuth,
  };
}
