import { userAPI, type IUserRestorePasswordDTO } from "../../../entities/user/api";
import { log } from "../../../shared/helpers/log";
import { afterRestorePasswordHook, onErrorRestorePasswordHook } from "../config/restore";

export function useRestorePassword() {
  const restorePassword = async (data: IUserRestorePasswordDTO) => {
    try {
      const response = await userAPI.restorePassword(data);

      afterRestorePasswordHook.run(response);
    } catch (error) {
      onErrorRestorePasswordHook.run();
      log.error("RESTORE_PASSWORD_ERROR", error);
    }
  };

  return {
    restorePassword,
  };
}

