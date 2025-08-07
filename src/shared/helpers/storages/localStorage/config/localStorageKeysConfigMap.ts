import { type LocalStorageKeyControllerOptions } from '../controllers/keyController';
import { expireMinutes, expireMonths, expireDays, expireHours } from '../../helpers';
import { LocalStorageKey } from './localStorageKeys';

type LocalStorageKeysMap = {
  [LocalStorageKey.WELCOME_BONUS_COUNT]: number;
  [LocalStorageKey.WELCOME_BONUS_SHOWN]: boolean;
  [LocalStorageKey.DONT_SHOW_PWA_AGAIN]: boolean;
  [LocalStorageKey.PWA_BONUS_TAKEN]: boolean;
  [LocalStorageKey.MOBILE_PROMO_BONUSES_SHOWN]: boolean;
  [LocalStorageKey.COUNT_SHOW_PWA]: number;
  [LocalStorageKey.REGISTRATION_SHOW_LEAVE_NOW_MODAL]: boolean;
  [LocalStorageKey.PWA_SCOPE_USER_REGISTERED]: number | null;
  [LocalStorageKey.WITHDRAWAL_CANCEL]: boolean;
  [LocalStorageKey.LAST_TIME_SHOW_PWA]: number | null;
  [LocalStorageKey.ANDROID_WEBVIEW_AUTO_ESCAPE_TRY]: boolean;
};

export type LocalStorageConfig = {
  [K in LocalStorageKey]: LocalStorageKeyControllerOptions<LocalStorageKeysMap[K]>;
};

export const LocalStorageConfigMap: LocalStorageConfig = {
  [LocalStorageKey.WELCOME_BONUS_COUNT]: {
    expires: expireDays(),
    defaultValue: () => 0,
  },
  [LocalStorageKey.WELCOME_BONUS_SHOWN]: {
    expires: expireDays(), // can be 30 minutes also
    defaultValue: () => false,
  },
  [LocalStorageKey.DONT_SHOW_PWA_AGAIN]: {
    expires: expireMonths(),
    defaultValue: () => false,
  },
  [LocalStorageKey.PWA_BONUS_TAKEN]: {
    defaultValue: () => false,
  },
  [LocalStorageKey.MOBILE_PROMO_BONUSES_SHOWN]: {
    expires: expireDays(),
    defaultValue: () => false,
  },
  [LocalStorageKey.COUNT_SHOW_PWA]: {
    expires: expireMonths(),
    defaultValue: () => 0,
  },
  [LocalStorageKey.REGISTRATION_SHOW_LEAVE_NOW_MODAL]: {
    expires: expireDays(),
    defaultValue: () => false,
  },
  [LocalStorageKey.PWA_SCOPE_USER_REGISTERED]: {
    expires: expireMonths(),
    defaultValue: () => null,
  },
  [LocalStorageKey.WITHDRAWAL_CANCEL]: {
    expires: expireMinutes(5),
    defaultValue: () => false,
  },
  [LocalStorageKey.LAST_TIME_SHOW_PWA]: {
    expires: expireHours(72),
    defaultValue: () => null,
  },
  [LocalStorageKey.ANDROID_WEBVIEW_AUTO_ESCAPE_TRY]: {
    expires: expireMonths(),
    defaultValue: () => false,
  },
};
