import { log } from '../../../shared/helpers/log';
import { authAPI, authEvents, type RegisterDTO } from '../../../entities/auth';
import { useFetchAllUserData } from './useFetchAllUserData';

export function useRegister() {
  const { fetchAllUserData } = useFetchAllUserData();

  async function register(data: RegisterDTO) {
    try {
      const response = await authAPI.register(data);

      authEvents.emit('register');

      if (response.success && response.user_is_logged) {
        await fetchAllUserData();
      }

      return response;
    } catch (error) {
      log.error('REGISTRATION_REQUEST_ERROR', error);
      throw error;
    }
  }

  return {
    register,
  };
}
