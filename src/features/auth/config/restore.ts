import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { IUserRestorePasswordResource } from '../../../entities/user/api/types';

export const afterRestorePasswordHook = createPromiseHook<IUserRestorePasswordResource>({
  hookError: 'AFTER_RESTORE_PASSWORD_HOOK_ERROR',
});

export const onErrorRestorePasswordHook = createPromiseHook({
  hookError: 'ON_ERROR_RESTORE_PASSWORD_HOOK_ERROR',
});