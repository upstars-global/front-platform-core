import { expireCookieMax, expireMonths } from '../helpers';

export enum COOKIE_NAME {
  AFFL_TOKEN = 'affl_token',
  COOKIE_ACCEPTED = 'cookies_accepted',
  LOCALE = 'locale',
}

export type CookieConfig = {
  expires?: () => number; // seconds
  path?: string;
  readonly?: boolean;
};

export const COOKIES_CONFIG_MAP: Record<COOKIE_NAME, CookieConfig> = {
  [COOKIE_NAME.AFFL_TOKEN]: {
    readonly: true,
  },
  [COOKIE_NAME.COOKIE_ACCEPTED]: {
    expires: expireCookieMax(),
  },
  [COOKIE_NAME.LOCALE]: {
    expires: expireMonths(),
    path: '/',
  },
};
