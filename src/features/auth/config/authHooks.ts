import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';

export const beforeLoginHook = createPromiseHook({
  hookError: 'BEFORE_LOGIN_HOOK_ERROR',
});

export const beforeLogoutHook = createPromiseHook({
  hookError: 'BEFORE_LOGOUT_HOOK_ERROR',
});
