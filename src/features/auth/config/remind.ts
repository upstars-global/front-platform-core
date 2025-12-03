import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { IUserRestorePasswordResource } from 'src/entities/user';

export const afterRestorePasswordRequestHook = createPromiseHook<IUserRestorePasswordResource>({
  hookError: 'AFTER_RESTORE_PASSWORD_REQUEST_HOOK_ERROR',
});

export const onErrorRestorePasswordRequestHook = createPromiseHook({
  hookError: 'ON_ERROR_RESTORE_PASSWORD_REQUEST_HOOK_ERROR',
});