import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { IUserRestorePasswordResource } from '../../../entities/user/api/types';

const RESTORE_PASSWORD_REQUEST_HOOK_ERRORS = {
  AFTER_RESTORE_PASSWORD_REQUEST: 'AFTER_RESTORE_PASSWORD_REQUEST_HOOK_ERROR',
  ON_ERROR_RESTORE_PASSWORD_REQUEST: 'ON_ERROR_RESTORE_PASSWORD_REQUEST_HOOK_ERROR',
} as const;

export const afterRestorePasswordRequestHook = createPromiseHook<IUserRestorePasswordResource>({
  hookError: RESTORE_PASSWORD_REQUEST_HOOK_ERRORS.AFTER_RESTORE_PASSWORD_REQUEST,
});

export const onErrorRestorePasswordRequestHook = createPromiseHook({
  hookError: RESTORE_PASSWORD_REQUEST_HOOK_ERRORS.ON_ERROR_RESTORE_PASSWORD_REQUEST,
});