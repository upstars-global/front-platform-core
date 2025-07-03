import { authAPI, type IChangePasswordDTO } from '../../../entities/auth';

export function useChangePassword() {
  async function changePassword(data: IChangePasswordDTO) {
    return await authAPI.changePassword(data);
  }

  return {
    changePassword,
  };
}
