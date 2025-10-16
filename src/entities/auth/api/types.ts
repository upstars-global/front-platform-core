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

export const IBIZA_ERROR_KEYS = {
  // INVALID
  InvalidBlacklisted: 'IBIZA.INVALID.BLACKLISTED',
  InvalidDomain: 'IBIZA.INVALID.INVALID_DOMAIN',
  InvalidEmail: 'IBIZA.INVALID.INVALID_EMAIL',
  InvalidRejectedEmail: 'IBIZA.INVALID.REJECTED_EMAIL',

  // RISKY
  RiskyInboxFull: 'IBIZA.RISKY.INBOX_FULL',
  RiskyNonPersonal: 'IBIZA.RISKY.NON_PERSONAL',
  RiskyRisky: 'IBIZA.RISKY.RISKY',
  RiskyTemporary: 'IBIZA.RISKY.TEMPORARY',
  RiskyTimeout: 'IBIZA.RISKY.TIMEOUT',

  // UNKNOWN
  UnknownUnknown: 'IBIZA.UNKNOWN.UNKNOWN',

  // VALID
  ValidAcceptedEmail: 'IBIZA.VALID.ACCEPTED_EMAIL',
  ValidWhitelisted: 'IBIZA.VALID.WHITELISTED',
} as const;

export type IbizaErrorKey = typeof IBIZA_ERROR_KEYS[keyof typeof IBIZA_ERROR_KEYS];

export interface IVerifyEmailResource {
  result: IbizaErrorKey;
}
