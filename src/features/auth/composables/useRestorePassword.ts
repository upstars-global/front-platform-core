import { userAPI, type IUserRestorePasswordDTO } from "../../../entities/user/api";
import { log } from "../../../shared/helpers/log";

export function useRestorePassword() {
  const restorePassword = async (data: IUserRestorePasswordDTO) => {
    try {
      const response = await userAPI.restorePassword(data);
      return response;
    } catch (error) {
      log.error("RESTORE_PASSWORD_ERROR", error);
      throw error;
    }
  };

  return {
    restorePassword,
  };
}

