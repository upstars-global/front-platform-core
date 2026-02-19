import { userAPI } from "../../../entities/user/api";
import { log } from "../../../shared/helpers/log";

export function useRestorePasswordRequest() {
  const restorePasswordRequest = async (login: string) => {
    try {
      const response = await userAPI.restorePasswordRequest(login);

      return response;
    } catch (error) {
      log.error("RESTORE_PASSWORD_REQUEST_ERROR", error);
      throw error;
    }
  };

  return {
    restorePasswordRequest,
  };
}

