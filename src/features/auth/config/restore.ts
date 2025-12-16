import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { IUserRestorePasswordResource } from '../../../entities/user/api/types';

const RESTORE_PASSWORD_HOOK_ERRORS = {
  AFTER_RESTORE_PASSWORD: 'AFTER_RESTORE_PASSWORD_HOOK_ERROR',
  ON_ERROR_RESTORE_PASSWORD: 'ON_ERROR_RESTORE_PASSWORD_HOOK_ERROR',
} as const;

export const afterRestorePasswordHook = createPromiseHook<IUserRestorePasswordResource>({
  hookError: RESTORE_PASSWORD_HOOK_ERRORS.AFTER_RESTORE_PASSWORD,
});

export const onErrorRestorePasswordHook = createPromiseHook({
  hookError: RESTORE_PASSWORD_HOOK_ERRORS.ON_ERROR_RESTORE_PASSWORD,
});