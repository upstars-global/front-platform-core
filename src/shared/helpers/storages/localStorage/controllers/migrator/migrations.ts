import type { Migration } from './types';
import { expireDays, expireHours, expireMinutes, expireMonths } from '../../../helpers';
import { LocalStorageKey } from '../../config/localStorageKeys';
import { log } from '../../../../log';
import cookie from '../../../cookies/controllers/CookieController';

export const migrations: Migration[] = [
  {
    version: 2,
    migrate: () => {
      const visitedStoriesValue = localStorage.getItem('visitedStories');
      const hideStoriesMessageValue = localStorage.getItem('hideStoriesMessage');
      const allStoriesVisitedDateValue = localStorage.getItem('allStoriesVisitedDate');

      if (visitedStoriesValue) {
        localStorage.setItem('visitedStories_bonuses', visitedStoriesValue);
        localStorage.removeItem('visitedStories');
      }
      if (hideStoriesMessageValue) {
        localStorage.setItem('hideStoriesMessages_bonuses', hideStoriesMessageValue);
        localStorage.removeItem('hideStoriesMessage');
      }
      if (allStoriesVisitedDateValue) {
        localStorage.setItem('allStoriesVisitedDate_bonuses', allStoriesVisitedDateValue);
        localStorage.removeItem('allStoriesVisitedDate');
      }
    },
  },
  {
    version: 3,
    migrate: () => {
      const key = 'GLOBAL_EVENT_MAILBOX_OPEN_FLAG';
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data) as {
            value: boolean;
            expire: string;
          };

          const oldExpire = new Date(parsed.expire);
          const expire = Math.floor(oldExpire.getTime() / 1000);

          localStorage.setItem(
            key,
            JSON.stringify({
              expire,
              value: parsed.value,
            }),
          );
        } catch (error) {
          log.error(`LOCAL_STORAGE_MIGRATION_VERSION_3 '${data}'`, error);
        }
      }
    },
  },
  {
    version: 4,
    migrate: () => {
      function getParsedCookieValue<T>(key: string, parser: (value: unknown) => T): T | undefined {
        try {
          const cookieValue = cookie.get(key);
          if (cookieValue !== undefined) {
            return parser(cookieValue);
          }
        } catch (error: unknown) {
          log.error(`LOCAL_STORAGE_MIGRATION_VERSION_4 getParsedCookieValue:'${key}'`, error);
        }
        return undefined;
      }
      type TranslateCookieToLSParams<T> = {
        cookieKey: string;
        localStorageKey: string;
        parser: (value: unknown) => T;
        expires?: () => number;
      };
      function translateCookieToLS<T>(params: TranslateCookieToLSParams<T>) {
        const value = getParsedCookieValue(params.cookieKey, params.parser);
        if (value !== undefined) {
          let expire = null;
          if (params.expires) {
            expire = Math.floor(Date.now() / 1000) + params.expires();
          }
          localStorage.setItem(
            params.localStorageKey,
            JSON.stringify({
              value,
              expire,
            }),
          );
        }
      }

      translateCookieToLS({
        cookieKey: 'dont-show-pwa-again',
        localStorageKey: LocalStorageKey.DONT_SHOW_PWA_AGAIN,
        parser: Boolean,
        expires: expireMonths(),
      });
      translateCookieToLS({
        cookieKey: 'welcome-bonus-count',
        localStorageKey: LocalStorageKey.WELCOME_BONUS_COUNT,
        expires: expireDays(),
        parser: Number,
      });
      translateCookieToLS({
        cookieKey: 'welcome-bonus-shown',
        localStorageKey: LocalStorageKey.WELCOME_BONUS_SHOWN,
        expires: expireDays(),
        parser: Boolean,
      });
      translateCookieToLS({
        cookieKey: 'pwa-logged',
        localStorageKey: LocalStorageKey.PWA_BONUS_TAKEN,
        parser: Boolean,
      });
      translateCookieToLS({
        cookieKey: 'promo_tooltip',
        localStorageKey: LocalStorageKey.MOBILE_PROMO_BONUSES_SHOWN,
        expires: expireDays(),
        parser: Boolean,
      });
      translateCookieToLS({
        cookieKey: 'count-show-pwa',
        localStorageKey: LocalStorageKey.COUNT_SHOW_PWA,
        expires: expireMonths(),
        parser: Number,
      });
      translateCookieToLS({
        cookieKey: 'showLeaveNowModal',
        localStorageKey: LocalStorageKey.REGISTRATION_SHOW_LEAVE_NOW_MODAL,
        expires: expireDays(),
        parser: Boolean,
      });
      translateCookieToLS({
        cookieKey: 'user-register-pwa-scope',
        localStorageKey: LocalStorageKey.PWA_SCOPE_USER_REGISTERED,
        expires: expireMonths(),
        parser: Number,
      });
      translateCookieToLS({
        cookieKey: 'wdCancel',
        localStorageKey: LocalStorageKey.WITHDRAWAL_CANCEL,
        expires: expireMinutes(5),
        parser: Boolean,
      });
      translateCookieToLS({
        cookieKey: 'last-time-show-pwa',
        localStorageKey: LocalStorageKey.LAST_TIME_SHOW_PWA,
        expires: expireHours(72),
        parser: Number,
      });
      translateCookieToLS({
        cookieKey: 'android-meta-escape-scope.auto-escape-try',
        localStorageKey: LocalStorageKey.ANDROID_WEBVIEW_AUTO_ESCAPE_TRY,
        expires: expireMonths(),
        parser: Boolean,
      });
    },
  },
];
