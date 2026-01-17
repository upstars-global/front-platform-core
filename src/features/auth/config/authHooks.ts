import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { RegisterResource, IVerifyEmailResource, LoginResource } from '../../../entities/auth';
import type { VerifyEmailStatus } from '../libs';

export type EmailVerificationResult = {
  email: string;
  status: VerifyEmailStatus;
  invalidCode?: IVerifyEmailResource['result'];
};

export const AUTH_HOOK_ERRORS = {
  BEFORE_LOGIN: 'BEFORE_LOGIN_HOOK_ERROR',
  BEFORE_LOGOUT: 'BEFORE_LOGOUT_HOOK_ERROR',
  AFTER_LOGIN: 'AFTER_LOGIN_HOOK_ERROR',
  ON_ERROR_LOGIN: 'ON_ERROR_LOGIN_HOOK_ERROR',
  AFTER_REGISTRATION: 'AFTER_REGISTRATION_HOOK_ERROR',
  AFTER_EMAIL_VERIFY: 'AFTER_EMAIL_VERIFY_HOOK_ERROR',
  ON_ERROR_REGISTRATION: 'ON_ERROR_REGISTRATION_HOOK_ERROR',
} as const;

export const beforeLoginHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGIN,
});

export const beforeLogoutHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGOUT,
});

export const afterLoginHook = createPromiseHook<LoginResource>({
  hookError: AUTH_HOOK_ERRORS.AFTER_LOGIN,
});

export const onErrorLoginHook = createPromiseHook<unknown>({
  hookError: AUTH_HOOK_ERRORS.ON_ERROR_LOGIN,
});

export const afterRegistrationHook = createPromiseHook<RegisterResource>({
  hookError: AUTH_HOOK_ERRORS.AFTER_REGISTRATION,
});

export const onErrorRegistrationHook = createPromiseHook<unknown>({
  hookError: AUTH_HOOK_ERRORS.ON_ERROR_REGISTRATION,
});

export const afterEmailVerifyHook = createPromiseHook<EmailVerificationResult>({
  hookError: AUTH_HOOK_ERRORS.AFTER_EMAIL_VERIFY,
});
