import { log } from '../../../shared/helpers/log';
import { authAPI, authEvents, type RegisterDTO } from '../../../entities/auth';
import { afterRegistrationHook, onErrorRegistrationHook } from '../config/authHooks';
import { useFetchAllUserData } from './useFetchAllUserData';

export class RegistrationFailureError extends Error {
  public readonly errorData: unknown;

  constructor(message: string, errorData: unknown) {
    super(message);
    this.errorData = errorData;
  }
}

export function useRegister() {
  const { fetchAllUserData } = useFetchAllUserData();

  async function register(data: RegisterDTO) {
    try {
      const response = await authAPI.register(data);

      authEvents.emit('register');

      if (response.success && response.user_is_logged) {
        await fetchAllUserData();
      }

      afterRegistrationHook.run(response);

      return response;
    } catch (error) {
      onErrorRegistrationHook.run(error);
      log.error('REGISTRATION_REQUEST_ERROR', error);
    }
  }

  return {
    register,
  };
}
