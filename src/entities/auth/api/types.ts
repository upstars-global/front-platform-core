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

export interface IVerifyEmailResource {
  result: string;
}
