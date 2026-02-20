import type { LoginErrorCaptchaRequiredResource, LoginErrorResource, LoginSuccessResource } from '../../../entities/auth';

export function isLoginSuccessResource(value: unknown): value is LoginSuccessResource {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Boolean((value as LoginSuccessResource)?.step);
}

export function isLoginErrorCaptchaRequiredResource(value: unknown): value is LoginErrorCaptchaRequiredResource {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Boolean((value as LoginErrorCaptchaRequiredResource)?.captcha_required);
}

export function isLoginErrorResource(value: unknown): value is LoginErrorResource {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Boolean((value as LoginErrorResource)?.message);
}
