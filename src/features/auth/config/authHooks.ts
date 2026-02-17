import { createPromiseHook } from '../../../shared/helpers/config/createPromiseHook';
import type { IVerifyEmailResource } from '../../../entities/auth';
import type { VerifyEmailStatus } from '../libs';

export type EmailVerificationResult = {
  email: string;
  status: VerifyEmailStatus;
  invalidCode?: IVerifyEmailResource['result'];
};

export const AUTH_HOOK_ERRORS = {
  BEFORE_LOGIN: 'BEFORE_LOGIN_HOOK_ERROR',
  BEFORE_LOGOUT: 'BEFORE_LOGOUT_HOOK_ERROR',
  AFTER_EMAIL_VERIFY: 'AFTER_EMAIL_VERIFY_HOOK_ERROR',
} as const;

export const beforeLoginHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGIN,
});

export const beforeLogoutHook = createPromiseHook({
  hookError: AUTH_HOOK_ERRORS.BEFORE_LOGOUT,
});

export const afterEmailVerifyHook = createPromiseHook<EmailVerificationResult>({
  hookError: AUTH_HOOK_ERRORS.AFTER_EMAIL_VERIFY,
});
