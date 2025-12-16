import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';

export const AUTH_HOOK_ERRORS = {
  BEFORE_LOGIN: 'BEFORE_LOGIN_HOOK_ERROR',
  BEFORE_LOGOUT: 'BEFORE_LOGOUT_HOOK_ERROR',
} as const;

export const beforeLoginHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGIN,
});

export const beforeLogoutHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGOUT,
});
