export type UserDeviceInfo = {
  os?: string;
  screen_resolution?: string;
};

export type LoginDTO = Record<string, unknown> &
  UserDeviceInfo & {
    _password: string;
    _username: string;
    captcha_key?: string;
  };

export interface IRegisterDTO extends UserDeviceInfo {
  accept_notifications: boolean;
  accept_terms: boolean;
  auth_type: string;
  chosen_country: string;
  currency: string;
  localization: string;
  login: string;
  password: string;
  promo_code: string;
}

export interface IChangePasswordDTO {
  code?: string;
  password: string;
}

export enum LoginResourceStep {
  EMAIL_VERIFICATION = 'email_verification',
}

export interface ILoginResource {
  step?: LoginResourceStep | string;
}

export type LoginErrorDTO = {
  captcha_required?: boolean;
  message?: string;
};

export interface ILogoutResource {
  redirect: string;
  success: boolean;
}

export interface IRegisterResource {
  success: boolean;
  user_is_logged: boolean;
  isAlreadyRegistered?: boolean;
}

export enum IbizaErrorKey {
  // INVALID
  INVALID_BLACKLISTED = 'IBIZA.INVALID.BLACKLISTED',
  INVALID_DOMAIN = 'IBIZA.INVALID.INVALID_DOMAIN',
  INVALID_EMAIL = 'IBIZA.INVALID.INVALID_EMAIL',
  INVALID_REJECTED_EMAIL = 'IBIZA.INVALID.REJECTED_EMAIL',

  // RISKY
  RISKY_INBOX_FULL = 'IBIZA.RISKY.INBOX_FULL',
  RISKY_NON_PERSONAL = 'IBIZA.RISKY.NON_PERSONAL',
  RISKY_RISKY = 'IBIZA.RISKY.RISKY',
  RISKY_TEMPORARY = 'IBIZA.RISKY.TEMPORARY',
  RISKY_TIMEOUT = 'IBIZA.RISKY.TIMEOUT',

  // UNKNOWN
  UNKNOWN_UNKNOWN = 'IBIZA.UNKNOWN.UNKNOWN',

  // VALID
  VALID_ACCEPTED_EMAIL = 'IBIZA.VALID.ACCEPTED_EMAIL',
  VALID_WHITELISTED = 'IBIZA.VALID.WHITELISTED',
}

export interface IVerifyEmailResource {
  result: IbizaErrorKey;
}
