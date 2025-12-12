import { userAPI } from "../../../entities/user/api";
import { log } from "../../../shared/helpers/log";
import { afterRestorePasswordRequestHook, onErrorRestorePasswordRequestHook } from "../config/remind";

export function useRestorePasswordRequest() {
  const restorePasswordRequest = async (login: string) => {
    try {
      const response = await userAPI.restorePasswordRequest(login);

      afterRestorePasswordRequestHook.run(response);
    } catch (error) {
      onErrorRestorePasswordRequestHook.run();
      log.error("RESTORE_PASSWORD_REQUEST_ERROR", error);
    }
  };

  return {
    restorePasswordRequest,
  };
}

