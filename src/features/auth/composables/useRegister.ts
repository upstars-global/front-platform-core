import { authAPI, authEvents, type IRegisterDTO } from '../../../entities/auth';
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

  async function register(data: IRegisterDTO) {
    const registerResponse = await authAPI.register(data);
    if (!registerResponse.success) {
      throw new RegistrationFailureError('Registration not success', registerResponse);
    }
    authEvents.emit('register');
    if (registerResponse.user_is_logged) {
      await fetchAllUserData();
    }
    return registerResponse;
  }

  return {
    register,
  };
}
